require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Oxylabs API credentials
const OXYLABS_API_KEY = process.env.OXYLABS_API_KEY;
const OXYLABS_API_PASSWORD = process.env.OXYLABS_API_PASSWORD;

// Helper function to sleep
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to poll for results
async function pollResults(resultsUrl, maxAttempts = 30, delayMs = 2000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    console.log(`Polling attempt ${attempt}/${maxAttempts}...`);
    
    const response = await axios.get(resultsUrl, {
      auth: {
        username: OXYLABS_API_KEY,
        password: OXYLABS_API_PASSWORD
      },
      headers: {
        'Content-Type': 'application/json'
      },
      validateStatus: () => true // Accept any status code
    });

    const data = response.data;
    
    // Check for 204 No Content - results not ready yet
    if (response.status === 204 || !data.results || data.results.length === 0) {
      console.log('Results not ready yet, retrying...');
      if (attempt < maxAttempts) {
        await sleep(delayMs);
      }
      continue;
    }
    
    // Check if results are available - results come as an array with content
    if (data.results && data.results.length > 0 && data.results[0].content) {
      console.log('Results ready!');
      return data;
    }
    
    // If we got data but no results yet, wait and retry
    if (attempt < maxAttempts) {
      await sleep(delayMs);
    }
  }
  
  throw new Error('Timeout waiting for results');
}

// API endpoint to scrape Google AI Overview
app.post('/api/scrape', async (req, res) => {
  try {
    const { query, country } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    
    const payload = {
      source: 'google',
      url: searchUrl,
      render: 'html',
      parse: true,
      geo_location: country || 'United States'
    };

    console.log('Sending request to Oxylabs:', payload);

    // Step 1: Submit the query
    const submitResponse = await axios.post(
      'https://data.oxylabs.io/v1/queries',
      payload,
      {
        auth: {
          username: OXYLABS_API_KEY,
          password: OXYLABS_API_PASSWORD
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Query submitted, job ID:', submitResponse.data.id);
    
    // Step 2: Get the results URL from the _links (use https instead of http)
    const resultsLink = submitResponse.data._links?.find(link => link.rel === 'results');
    
    if (!resultsLink) {
      throw new Error('No results link found in response');
    }
    
    // Fix: Use https instead of http (API requires https)
    const resultsUrl = resultsLink.href.replace('http://', 'https://');
    console.log('Results URL:', resultsUrl);
    
    // Step 3: Poll for results
    const results = await pollResults(resultsUrl);
    
    console.log('Results received!');
    res.json(results);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to fetch data from Oxylabs',
      details: error.response?.data || error.message
    });
  }
});

// Serve the frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
