# AppFinder - AI-Powered App Recommendation Assistant

A responsive web application that recommends mobile and web apps based on user needs. The app features a conversational interface and provides tailored app suggestions in various categories through an API integration.

## Features

- **API Integration**: Uses an app recommendation API to fetch the most relevant and up-to-date app suggestions
- **Conversational UI**: Chat-like interface that asks follow-up questions to better understand user needs
- **Multiple Categories**: Supports recommendations for productivity, focus, fitness, meditation, language learning, finance, reading, music, and photography
- **Detailed Recommendations**: Each app suggestion includes descriptions, benefits, and available platforms
- **Responsive Design**: Works on desktop and mobile devices

## How It Works

1. User enters what they're looking for (e.g., "I need an app to help me focus better")
2. The system identifies the relevant category and asks a follow-up question
3. Based on the user's response, the system queries the API for the most relevant app recommendations
4. Up to 3 relevant apps are displayed with details about what each app does, why it's useful, and which platforms it's available on

## Technologies Used

- HTML5
- CSS3 (with responsive design)
- Vanilla JavaScript
- RESTful API integration
- Font Awesome for icons

## Getting Started

1. Open `index.html` in your web browser to use the application.
2. Replace the `API_KEY` value in `app.js` with your actual API key.

### API Configuration

To use the app with a real API:
1. Sign up for an API key at the app recommendation service provider
2. Replace the placeholder API key in app.js: 
   ```javascript
   const API_KEY = 'your_api_key_here'; // Replace with your actual API key
   ```
3. Update the API_BASE_URL if necessary: 
   ```javascript
   const API_BASE_URL = 'https://api.appfinder.example.com/v1/recommendations';
   ```

## Testing Mode

The application includes a testing mode that simulates API responses if no valid API key is provided. This allows you to test the functionality without an actual API connection.

## Expanding the App

To add more app categories or recommendation capabilities:

1. Add new entries to the keywordMap object to recognize additional categories
2. Add follow-up questions for new categories in the followUpQuestions object
3. If using the mock API mode, add sample app data to the mockData object

## License

MIT License - Feel free to use and modify for your own projects 