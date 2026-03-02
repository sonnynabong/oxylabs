# Google AI Overview Scraper

A simple Node.js application that uses the Oxylabs Web Scraper API to fetch Google search results including AI Overviews.

## Features

- **Search Google** and get AI-generated Overviews
- **Country/Geo-location selection** (20+ countries)
- **Organic search results** with titles, descriptions, and URLs
- **Related searches** with clickable suggestions
- **Raw JSON response viewer** for debugging
- **Asynchronous polling** - handles Oxylabs API job queue automatically
- **Modern, responsive UI** with gradient design

## Prerequisites

- Node.js (v14 or higher)
- Oxylabs API credentials (free trial available)

## Getting Oxylabs API Credentials (Free Trial)

1. **Create a free account** at [https://oxylabs.io](https://oxylabs.io)
2. **Start your free trial** - Oxylabs offers a free trial with API credits
3. **Get your API credentials** from the dashboard:
   - Username (API Key)
   - Password (API Password)

## Setup

1. **Clone or download this repository**

2. **Create a `.env` file** in the root directory with your Oxylabs credentials:
   ```
   OXYLABS_API_KEY=your_api_username
   OXYLABS_API_PASSWORD=your_api_password
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

## Running the Application

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The application will be available at **http://localhost:3000**

## Usage

1. Open your browser and navigate to **http://localhost:3000**
2. Enter your search query in the input field
3. Select a country from the dropdown (optional, defaults to United States)
4. Click the **"Search"** button
5. Wait 10-30 seconds for results (the API is asynchronous)

### Results include:
- **AI Overview** - Google's AI-generated summary with key points and sources
- **Organic Results** - Traditional search results with rankings
- **Related Searches** - Suggested related queries (clickable)
- **Raw Response** - Complete JSON response from Oxylabs API

## API Reference

This application uses the **Oxylabs Google Scraper API**:
- **API Endpoint:** `https://data.oxylabs.io/v1/queries`
- **Documentation:** https://developers.oxylabs.io/scraping-solutions/web-scraper-api/targets/google/ai-overviews

### How the API Works

The Oxylabs API is **asynchronous**:
1. You submit a query → receive a job ID with status "pending"
2. The scraper fetches and parses the Google page
3. You poll the results endpoint until data is ready
4. Results include AI Overview, organic results, and more

## Project Structure

```
.
├── .env                    # Environment variables (API credentials)
├── package.json            # Node.js dependencies
├── server.js               # Express server (backend API)
├── README.md               # This file
└── public/                 # Frontend files
    ├── index.html          # Main HTML page
    ├── styles.css          # Styling
    └── app.js              # Frontend JavaScript
```

## Technologies Used

- **Backend:** Node.js, Express, Axios
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **API:** Oxylabs Web Scraper API

## Troubleshooting

### "No response" or timeout
- The Oxylabs API can take 10-30 seconds to return results
- The app shows "Fetching results (this may take 10-30s)..." during polling
- If it takes longer, check your API credentials in `.env`

### "Failed to fetch data from Oxylabs"
- Verify your API credentials are correct in `.env`
- Ensure your Oxylabs account is active and has available credits
- Check the server console for detailed error messages

### "No AI Overview available"
- Not all search queries have AI Overviews
- Try queries like "what is artificial intelligence" or "best seo companies"
- AI Overviews depend on Google's availability for the specific query

## Rate Limits

Check your Oxylabs dashboard for current rate limits and usage. Free trial accounts have limited requests.

## License

MIT

---

**Made with love using [Oxylabs](https://oxylabs.io)**
