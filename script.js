const temp = document.getElementById("temp"),
  date = document.getElementById("date-time"),
  currentLocation = document.getElementById("location"),
  condition = document.getElementById("condition"),
  rain = document.getElementById("rain"),
  mainIcon = document.getElementById("icon"),
  uvIndex = document.querySelector(".uv-index"),
  uvText = document.querySelector(".uvText"),
  windSpeed = document.querySelector(".wind-speed"),
  windText = document.getElementById('windText'), 
  sunRise = document.querySelector(".sunrise"),
  sunSet = document.querySelector(".sunset"),
  humidity = document.querySelector(".humidity"),
  visibility = document.querySelector(".visibility"),
  humidityStatus = document.querySelector(".humidity-status"),
  airQuality = document.querySelector(".air-quality"),
  airQualityStatus = document.querySelector(".air-quality-status"),
  visibilityStatus = document.querySelector(".visibility-status"),
  weatherCards = document.getElementById("weather-cards"),
  celciusBtn = document.querySelector(".celcius"),
  fahrenheitBtn = document.querySelector(".fahrenheit"),
  hourlyBtn = document.querySelector(".hourly"),
  weekBtn = document.querySelector(".week"),
  tempUnit = document.querySelectorAll(".temp-unit"),
  searchForm = document.querySelector("#search"),
  search = document.querySelector("#query"),
  weatherNewsBtn = document.getElementById('weatherNewsBtn'),
  newsArticlesContainer = document.querySelector('.news-articles');

let currentCity = "";
let currentUnit = "c";
let hourlyorWeek = "week"; // Default to weekly view

function getDateTime() {
  let now = new Date(),
    hour = now.getHours(),
    minute = now.getMinutes();

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  hour = hour ? hour : 12; // the hour '0' should be '12'
  hour = hour < 10 ? "0" + hour : hour;
  minute = minute < 10 ? "0" + minute : minute;

  let dayString = days[now.getDay()];
  return `${dayString}, ${hour}:${minute} ${ampm}`;
}

date.innerText = getDateTime();

setInterval(() => {
  date.innerText = getDateTime();
}, 1000);


function getPublicIp() {
  fetch("https://geolocation-db.com/json/", {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      currentCity = data.city;
      getWeatherData(data.city, currentUnit, hourlyorWeek);
    });
}

// Call getPublicIp only on page load
getPublicIp();

function getWeatherData(city, unit, hourlyorWeek) {
  const apiKey = "9XSMLW5UJ9BQRWGZQVEVM9SC9";
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}&contentType=json`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data); // Add this line to see the full response data
      let today = data.currentConditions;
      if (unit === "c") {
        temp.innerText = today.temp;
      } else {
        temp.innerText = celciusToFahrenheit(today.temp);
      }
      currentLocation.innerText = data.resolvedAddress;
      condition.innerText = today.conditions;
      rain.innerText = "Perc - " + today.precip + "%";
      uvIndex.innerText = today.uvindex;
      windSpeed.innerText = today.windspeed;
      humidity.innerText = today.humidity + "%";
      visibility.innerText = today.visibility;
      airQuality.innerText = today.winddir;
      measureUvIndex(today.uvindex);
      updateHumidityStatus(today.humidity);
      updateVisibilityStatus(today.visibility);
      updateAirQualityStatus(today.winddir);
      sunRise.innerText = convertTimeTo12HourFormat(today.sunrise);
      sunSet.innerText = convertTimeTo12HourFormat(today.sunset);
      updateWindStatus(today.windspeed);
      mainIcon.src = getIcon(today.icon);
      changeBackground(today.icon);
      if (hourlyorWeek === "hourly") {
        updateForecast(data.days[0].hours, unit, "day");
      } else {
        updateForecast(data.days, unit, "week");
      }

      // Call drawTemperatureChart with actual dayTemperatures and nightTemperatures data
      let dayTemperatures = data.days.map(day => day.tempmax);
      let nightTemperatures = data.days.map(day => day.tempmin);
      drawTemperatureChart(dayTemperatures, nightTemperatures);
    })
    .catch((err) => {
      console.log(err);
      alert("Invalid Location");
    });
}


function celciusToFahrenheit(temp) {
  return ((temp * 9) / 5 + 32).toFixed(1);
}

function measureUvIndex(uvIndex) {
  if (uvIndex <= 2) {
    uvText.innerText = "Low";
  } else if (uvIndex <= 5) {
    uvText.innerText = "Moderate";
  } else if (uvIndex <= 7) {
    uvText.innerText = "High";
  } else if (uvIndex <= 10) {
    uvText.innerText = "Very High";
  } else {
    uvText.innerText = "Extreme";
  }
}

function updateWindStatus(windSpeed) {
  windSpeed = Number(windSpeed);

  let windTextContent;
  if (windSpeed <= 0.2) {
      windTextContent = "Calm";
  } else if (windSpeed <= 5.5) {
      windTextContent = "Light air";
  } else if (windSpeed <= 11.9) {
      windTextContent = "Light breeze";
  } else if (windSpeed <= 19.7) {
      windTextContent = "Gentle breeze";
  } else if (windSpeed <= 28.7) {
      windTextContent = "Moderate breeze";
  } else if (windSpeed <= 38.8) {
      windTextContent = "Fresh breeze";
  } else if (windSpeed <= 49.9) {
      windTextContent = "Strong breeze";
  } else if (windSpeed <= 61.9) {
      windTextContent = "High wind";
  } else if (windSpeed <= 74.9) {
      windTextContent = "Gale";
  } else if (windSpeed <= 87.9) {
      windTextContent = "Strong gale";
  } else if (windSpeed <= 101.9) {
      windTextContent = "Storm";
  } else if (windSpeed <= 115.9) {
      windTextContent = "Violent storm";
  } else {
      windTextContent = "Hurricane";
  }
  
  windText.innerText = `${windTextContent} (km/h)`;
}

function updateHumidityStatus(humidity) {
  if (humidity <= 30) {
    humidityStatus.innerText = "Low";
  } else if (humidity <= 60) {
    humidityStatus.innerText = "Moderate";
  } else {
    humidityStatus.innerText = "High";
  }
}

function updateVisibilityStatus(visibility) {
  if (visibility <= 0.3) {
    visibilityStatus.innerText = "Dense Fog";
  } else if (visibility <= 0.16) {
    visibilityStatus.innerText = "Moderate Fog";
  } else if (visibility <= 0.35) {
    visibilityStatus.innerText = "Light Fog";
  } else if (visibility <= 1.23) {
    visibilityStatus.innerText = "Very Light Fog";
  } else if (visibility <= 2.16) {
    visibilityStatus.innerText = "Light Mist";
  } else if (visibility <= 5.4) {
    visibilityStatus.innerText = "Very Light Mist";
  } else if (visibility <= 10.8) {
    visibilityStatus.innerText = "Clear Air";
  } else {
    visibilityStatus.innerText = "Very Clear Air";
  }
}

function updateAirQualityStatus(airQuality) {
  if (airQuality <= 50) {
    airQualityStatus.innerText = "Good";
  } else if (airQuality <= 100) {
    airQualityStatus.innerText = "Moderate";
  } else if (airQuality <= 150) {
    airQualityStatus.innerText = "Unhealthy for Sensitive Groups";
  } else if (airQuality <= 200) {
    airQualityStatus.innerText = "Unhealthy";
  } else if (airQuality <= 250) {
    airQualityStatus.innerText = "Very Unhealthy";
  } else {
    airQualityStatus.innerText = "Hazardous";
  }
}

function convertTimeTo12HourFormat(time) {
  let [hour, minute] = time.split(":").map(Number);
  let ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12; // the hour '0' should be '12'
  minute = minute < 10 ? "0" + minute : minute;
  return `${hour}:${minute} ${ampm}`;
}

function getIcon(condition) {
  switch (condition) {
    case "partly-cloudy-day":
      return "./partly cloudy day.png";
    case "partly-cloudy-night":
      return "./partly cloudy night.png";
    case "rain":
      return "./rain.jpg";
    case "clear-day":
      return "./clear day.jpg";
    case "clear-night":
      return "./clear_night.jpeg";
    default:
      return "./sunny.jpg";
  }
}

function getDayName(date) {
  let day = new Date(date);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[day.getDay()];
}

function getHour(time) {
  let [hour, min] = time.split(":");
  let ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12; // the hour '0' should be '12'
  return `${hour}:${min} ${ampm}`;
}

function updateForecast(data, unit, type) {
  weatherCards.innerHTML = "";
  let numCards = type === "day" ? 24 : 7;
  for (let i = 0; i < numCards; i++) {
    let card = document.createElement("div");
    card.classList.add("card");
    let dayName, dayTemp, iconCondition, iconSrc;
    if (type === "week") {
      dayName = getDayName(data[i].datetime);
      dayTemp = data[i].temp;
      iconCondition = data[i].icon;
      iconSrc = getIcon(iconCondition);
    } else {
      dayName = getHour(data[i].datetime);
      dayTemp = data[i].temp;
      iconCondition = data[i].icon;
      iconSrc = getIcon(iconCondition);
    }
    if (unit === "f") {
      dayTemp = celciusToFahrenheit(dayTemp);
    }
    let tempUnit = unit === "c" ? "°C" : "°F";
    card.innerHTML = `
      <h2 class="day-name">${dayName}</h2>
      <div class="card-icon">
        <img src="${iconSrc}" class="day-icon" alt="" />
      </div>
      <div class="day-temp">
        <h2 class="temp">${dayTemp}</h2>
        <span class="temp-unit">${tempUnit}</span>
      </div>
    `;
    weatherCards.appendChild(card);
  }
}

function changeBackground(condition) {
  let body = document.querySelector("body");
  let bgImg;
  switch (condition) {
    case "partly-cloudy-day":
      bgImg = "url('./cloudy5.jpg')";
      break;
    case "partly-cloudy-night":
      bgImg = "url('./night3.jpg')";
      break;
    case "rain":
      bgImg = "url('./rainy3.jpg')";
      break;
    case "clear-day":
      bgImg = "url('./day2.jpg')";
      break;
    case "clear-night":
      bgImg = "url('./night4.jpg')";
      break;
    default:
      bgImg = "url('./day1.jpg')";
  }
  body.style.backgroundImage = `${bgImg}`;
}

fahrenheitBtn.addEventListener("click", () => {
  changeUnit("f");
});
celciusBtn.addEventListener("click", () => {
  changeUnit("c");
});

function changeUnit(unit) {
  if (currentUnit !== unit) {
    currentUnit = unit;
    tempUnit.forEach((elem) => {
      elem.innerText = unit === "c" ? "°C" : "°F";
    });
    getWeatherData(currentCity, currentUnit, hourlyorWeek);
  }
}

hourlyBtn.addEventListener("click", () => {
  toggleTimeSpan("hourly");
});

weekBtn.addEventListener("click", () => {
  toggleTimeSpan("week");
});

function toggleTimeSpan(span) {
  if (hourlyorWeek!== span) {
    hourlyorWeek = span;
    getWeatherData(currentCity, currentUnit, hourlyorWeek);
    // Toggle the active class on the buttons
    hourlyBtn.classList.toggle("active", span === "hourly");
    weekBtn.classList.toggle("active", span === "week");
  }
}

searchForm.addEventListener("submit",(e) => {
  e.preventDefault();
  let location=search.value;
  if(location) {
    currentCity=location;
    getWeatherData(currentCity, currentUnit, hourlyorWeek);
  }
})

cities = [
  "Bengaluru",
  "Belagavi",
  "Kalaburagi",
  "Pune",
  "Mumbai",
  "New Delhi",
  "Chennai",
  "Kolkata",
  "Hyderabad"
];

var currentFocus;
search.addEventListener("input", function(e) {
  removeSuggestions();
  var a, b, i, val = this.value;
  if (!val) {
    return false;
  }
  currentFocus = -1;
  a = document.createElement("ul");
  a.setAttribute("id", "suggestions");
  this.parentNode.appendChild(a);
  for (i = 0; i < cities.length; i++) {
    if (cities[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
      b = document.createElement("li");
      b.innerHTML = "<strong>" + cities[i].substr(0, val.length) + "</strong>";
      b.innerHTML += cities[i].substr(val.length);
      b.innerHTML += "<input type='hidden' value='" + cities[i] + "'>";
      b.addEventListener("click", function(e) {
        search.value = this.getElementsByTagName("input")[0].value;
        removeSuggestions();
      });
      a.appendChild(b);
    }
  }
});

function removeSuggestions() {
  var x = document.getElementById("suggestions");
  if (x) x.parentNode.removeChild(x);
}

search.addEventListener("keydown", function(e) {
  var x = document.getElementById("suggestions");
  if (x) x = x.getElementsByTagName("li");
  if (e.keyCode == 40) {
    currentFocus++;
    addActive(x);
  } else if (e.keyCode == 38) {
    currentFocus--;
    addActive(x);
  } else if (e.keyCode == 13) {
    e.preventDefault();
    if (currentFocus > -1) {
      if (x) x[currentFocus].click();
    }
  }
});

function addActive(x) {
  if (!x) return false;
  removeActive(x);
  if (currentFocus >= x.length) currentFocus = 0;
  if (currentFocus < 0) currentFocus = x.length - 1;
  x[currentFocus].classList.add("active");
}

function removeActive(x) {
  for (var i = 0; i < x.length; i++) {
    x[i].classList.remove("active");
  }
}

function drawTemperatureChart(dayTemperatures, nightTemperatures) {
  var ctx = document.getElementById('temperature-chart').getContext('2d');


  var existingChart = Chart.getChart(ctx);
  if (existingChart) {
      existingChart.destroy();
  }


  var temperatureChart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          datasets: [{
              label: 'Day Temperature',
              data: dayTemperatures,
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              tension: 0.3
          }, {
              label: 'Night Temperature',
              data: nightTemperatures,
              borderColor: 'rgba(54, 162, 235, 1)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              tension: 0.3
          }]
      },
      options: {
          scales: {
              x: {
                  title: {
                      display: true,
                      text: 'Days'
                  }
              },
              y: {
                  title: {
                      display: true,
                      text: 'Temperature (°C)'
                  },
                  beginAtZero: false
              }
          }
      }
  });
}

weatherNewsBtn.addEventListener('click', () => {
  toggleNewsSection();
});

// Function to toggle visibility of news section
function toggleNewsSection() {
  // Toggle visibility of news articles container
  newsArticlesContainer.classList.toggle('show-news');

  // If news section is visible, fetch news articles
  if (newsArticlesContainer.classList.contains('show-news')) {
      fetchWeatherNews();
  } else {
      // Clear news articles when hiding the section
      newsArticlesContainer.innerHTML = '';
  }
}

// Function to fetch weather news articles
function fetchWeatherNews() {
  const newsApiKey = '54980400681f4b5899b58a527a532a05';
  const newsUrl = `https://newsapi.org/v2/top-headlines?q=weather&apiKey=${newsApiKey}`;

  fetch(newsUrl)
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
      })
      .then(data => {
          displayNewsArticles(data.articles);
      })
      .catch(error => {
          console.error('Error fetching news:', error);
          alert('Failed to fetch weather news. Please try again later.');
      });
}

// Function to display fetched news articles
function displayNewsArticles(articles) {
  newsArticlesContainer.innerHTML = ''; // Clear previous articles
  articles.forEach(article => {
      const articleElement = document.createElement('div');
      articleElement.classList.add('news-article');

      const { title, description, url } = article;
      articleElement.innerHTML = `
          <h3>${title}</h3>
          <p>${description}</p>
          <a href="${url}" target="_blank">Read more</a>
      `;

      newsArticlesContainer.appendChild(articleElement);
  });
}

