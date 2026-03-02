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

    const response = await axios.post(
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

    console.log('Response received from Oxylabs');
    res.json(response.data);
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
