🌦️ Weather Forecasting Website

This is a fully responsive and interactive web application that displays real-time weather forecasts, weather highlights, and the latest weather-related news. The application automatically detects the user's location and displays the current weather, while also allowing users to search for weather data in other cities.

📌 Features:
- 🔍 Search weather by city name
- 📍 Auto-detects user’s location via IP
- 🌡️ Real-time temperature, humidity, wind, UV index, air quality, and more
- 📆 Toggle between hourly and weekly forecast views
- 📊 Temperature trend graph using Chart.js
- 📰 Latest weather-related news (via News API)
- 🎨 Dynamic weather icons and background images
- 🔁 Unit switch: °C and °F

🛠️ Tech Stack:

- HTML
- CSS
- JavaScript
- Visual Crossing Weather API (https://www.visualcrossing.com/)
- News API (https://newsapi.org/)
- Chart.js (https://www.chartjs.org/)

🧪 Getting Started:

1. Clone the repository.
   
   git clone https://github.com/your-username/weather-forecasting-website.git
   cd weather-forecasting-website
   
2. Add your API keys.
   
     - Open script.js and replace:
       
       const apiKey = "YOUR_VISUAL_CROSSING_API_KEY";
       const newsApiKey = "YOUR_NEWS_API_KEY";
       
     - Get keys from:
       
       https://www.visualcrossing.com/weather-api
       https://newsapi.org/
       
3. Open index.html in your browser.


✨ Future Improvements:

   🌐 Geolocation-based unit toggle

   ⏰ 10-day extended forecast

   📱 Improved mobile support

   🌤️ More accurate icon mappings

   🔒 Secure key management
