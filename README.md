# Google AI Overview Scraper

A simple Node.js application that uses the Oxylabs Web Scraper API to fetch Google search results including AI Overviews.

## Features

- 🔍 Search Google and get AI Overviews
- 🌍 Country/Geo-location selection (20+ countries)
- 📄 Organic search results
- 🔗 Related searches
- 📋 Raw JSON response viewer
- 🎨 Modern, responsive UI

## Prerequisites

- Node.js (v14 or higher)
- Oxylabs API credentials (API key and password)

## Setup

1. Clone or download this repository
2. Create a `.env` file in the root directory with your Oxylabs credentials:
   ```
   OXYLABS_API_KEY=your_api_key
   OXYLABS_API_PASSWORD=your_api_password
   ```
3. Install dependencies:
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

The application will be available at `http://localhost:3000`

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Enter your search query in the input field
3. Select a country from the dropdown (optional, defaults to United States)
4. Click the "Search" button
5. View the results:
   - 🤖 **AI Overview**: Google's AI-generated summary (if available)
   - 📄 **Organic Results**: Traditional search results
   - 🔗 **Related Searches**: Suggested related queries
   - 📋 **Raw Response**: Complete JSON response from Oxylabs API

## API Reference

This application uses the Oxylabs Google Scraper API:
- Endpoint: `https://data.oxylabs.io/v1/queries`
- Documentation: https://developers.oxylabs.io/scraping-solutions/web-scraper-api/targets/google/ai-overviews

## Project Structure

```
.
├── .env                    # Environment variables (API credentials)
├── package.json            # Node.js dependencies
├── server.js               # Express server
├── public/                 # Frontend files
│   ├── index.html          # Main HTML page
│   ├── styles.css          # Stylesheet
│   └── app.js              # Frontend JavaScript
└── README.md               # This file
```

## Technologies Used

- **Backend**: Node.js, Express
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **API**: Oxylabs Web Scraper API
- **HTTP Client**: Axios

## License

MIT
