let now = new Date();
let days = {
  long: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  short: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
};

let day = days.long[now.getDay()];
let hours = now.getHours();
if (hours < 10) {
  hours = `0${hours}`;
}
let minutes = now.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}

let dayTime = document.querySelector("#current-day-time");
dayTime.innerHTML = `${day}, ${hours}:${minutes}`;

function formatHour(timestamp) {
  let date = new Date(timestamp * 1000);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }

  return hours;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();

  return days.short[day];
}

function defaultCity() {
  let defaultCity = document.querySelector("#city");
  defaultCity.innerHTML = "KYIV";

  let apiKey = `59a6ae41a8d53cb647a89df95d0d7348`;
  let apiUrlCity = `https://api.openweathermap.org/data/2.5/weather?q=Kyiv&appid=${apiKey}`;

  axios.get(apiUrlCity).then(getCoords);
}

function getPosition() {
  navigator.geolocation.getCurrentPosition(myCoords);
  function myCoords(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    let apiKey = `59a6ae41a8d53cb647a89df95d0d7348`;
    let apiUrlCity = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
    axios.get(apiUrlCity).then(getCoords);
  }
}

function inputCity(event) {
  event.preventDefault();
  let input = document.querySelector("#input-city");
  let changeCity = document.querySelector("#city");
  changeCity.innerHTML = input.value.toUpperCase();

  let apiKey = `59a6ae41a8d53cb647a89df95d0d7348`;
  let apiUrlCity = `https://api.openweathermap.org/data/2.5/weather?q=${input.value.toUpperCase()}&appid=${apiKey}`;

  axios.get(apiUrlCity).then(getCoords);
}

function getCoords(response) {
  let currentCity = document.querySelector("#city");
  currentCity.innerHTML = response.data.name.toUpperCase();

  let lat = response.data.coord.lat;
  let lon = response.data.coord.lon;

  let apiKey = `59a6ae41a8d53cb647a89df95d0d7348`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=metric&appid=${apiKey}`;

  axios.get(apiUrl).then(parameters);
  axios.get(apiUrl).then(displayHourlyTemperature);
  axios.get(apiUrl).then(displayHourlyPrecipitation);
  axios.get(apiUrl).then(displayHourlyWind);
  axios.get(apiUrl).then(displayDailyForecast);
}

function parameters(response) {
  let weatherIcon = document.querySelector("#weather-icon");
  let temperature = document.querySelector("#degrees");
  let precipitation = document.querySelector("#precipitation");
  let humidity = document.querySelector("#humidity");
  let wind = document.querySelector("#wind");
  let uvIndex = document.querySelector("#uv-index");
  let description = document.querySelector("#current-weather");

  weatherIcon.setAttribute(
    "src",
    `media/weather-icons/${response.data.current.weather[0].icon}.svg`
  );
  weatherIcon.setAttribute("alt", response.data.current.weather[0].description);
  temperature.innerHTML = Math.round(response.data.current.temp);
  precipitation.innerHTML = Math.round(
    response.data.hourly[now.getHours()].pop * 100
  );
  humidity.innerHTML = Math.round(response.data.current.humidity);
  wind.innerHTML = Math.round(response.data.current.wind_speed);
  uvIndex.innerHTML = Math.round(response.data.current.uvi);
  description.innerHTML = response.data.current.weather[0].description;

  let temp = Math.round(response.data.current.temp);

  function changeTempFahrenheit() {
    let temperature = document.querySelector("#degrees");
    let fahrenheitTemperature = Math.round(temp * 1.8 + 32);
    temperature.innerHTML = fahrenheitTemperature;

    fahrenheit.classList.add("active");
    celsius.classList.remove("active");
  }

  function changeTempCelsius() {
    let celsiusTemperature = temp;
    let temperature = document.querySelector("#degrees");
    temperature.innerHTML = celsiusTemperature;

    celsius.classList.add("active");
    fahrenheit.classList.remove("active");
  }

  let fahrenheit = document.querySelector("#fahrenheit");
  fahrenheit.addEventListener("click", changeTempFahrenheit);

  let celsius = document.querySelector("#celsius");
  celsius.addEventListener("click", changeTempCelsius);
}
function displayHourlyTemperature(response) {
  let hourly = response.data.hourly;
  let hourlyTemp = document.querySelector("#hourly-temp");
  let hourlyTempHTML = "";
  hourly.forEach(function (getHour, index) {
    if (index > 0 && index < 25) {
      hourlyTempHTML =
        hourlyTempHTML +
        `<div id="hourly-forecast">
      <div>${formatHour(getHour.dt)}:00</div>
      <img src="media/weather-icons/${getHour.weather[0].icon}.svg" width="35"/>
      <div><span>${Math.round(getHour.temp)}°C</span></div>
      </div>`;
    }
  });
  hourlyTemp.innerHTML = hourlyTempHTML;
}

function displayHourlyPrecipitation(response) {
  let hourly = response.data.hourly;
  let hourlyPrec = document.querySelector("#hourly-prec");
  let hourlyPrecHTML = "";
  hourly.forEach(function (getHour, index) {
    if (index > 0 && index < 25) {
      let popValue = getHour.pop;
      if (popValue === 0) {
        popIcon = "prec0";
      } else if (popValue <= 0.25) {
        popIcon = "prec1";
      } else if (popValue <= 0.5) {
        popIcon = "prec2";
      } else if (popValue <= 0.75) {
        popIcon = "prec3";
      } else {
        popIcon = "prec4";
      }

      hourlyPrecHTML =
        hourlyPrecHTML +
        `<div id="hourly-forecast">
      <div>${formatHour(getHour.dt)}:00</div>
      <img src="media/weather-icons/${popIcon}.svg" width="35"/>
      <div><span>${Math.round(getHour.pop * 100)}%</span></div>
      </div>`;
    }
  });
  hourlyPrec.innerHTML = hourlyPrecHTML;
}

function displayHourlyWind(response) {
  let hourly = response.data.hourly;
  let hourlyWind = document.querySelector("#hourly-wind");
  let hourlyWindHTML = "";
  hourly.forEach(function (getHour, index) {
    if (index > 0 && index < 25) {
      let windSpeed = getHour.wind_speed;
      if (windSpeed <= 3.3) {
        windIcon = "wind1";
      } else if (windSpeed <= 10.7) {
        windIcon = "wind2";
      } else if (windSpeed <= 24.4) {
        windIcon = "wind3";
      } else {
        windIcon = "wind4";
      }
      hourlyWindHTML =
        hourlyWindHTML +
        `<div id="hourly-forecast">
      <div>${formatHour(getHour.dt)}:00</div>
      <img src="media/weather-icons/${windIcon}.svg" width="35"/>
      <div><span>${Math.round(getHour.wind_speed * 10) / 10} m/sec</span></div>
      </div>`;
    }
  });
  hourlyWind.innerHTML = hourlyWindHTML;
}

function showTemp() {
  tempBox.classList.add("active");
  precBox.classList.remove("active");
  windBox.classList.remove("active");

  document.getElementById("hourly-temp").style.display = "flex";
  document.getElementById("hourly-temp").style.position = "relative";
  document.getElementById("hourly-prec").style.display = "none";
  document.getElementById("hourly-prec").style.position = "absolute";
  document.getElementById("hourly-wind").style.display = "none";
  document.getElementById("hourly-wind").style.position = "absolute";
}

function showPrec() {
  precBox.classList.add("active");
  tempBox.classList.remove("active");
  windBox.classList.remove("active");

  document.getElementById("hourly-prec").style.display = "flex";
  document.getElementById("hourly-prec").style.position = "relative";
  document.getElementById("hourly-temp").style.display = "none";
  document.getElementById("hourly-temp").style.position = "absolute";
  document.getElementById("hourly-wind").style.display = "none";
  document.getElementById("hourly-wind").style.position = "absolute";
}

function showWind() {
  windBox.classList.add("active");
  tempBox.classList.remove("active");
  precBox.classList.remove("active");

  document.getElementById("hourly-wind").style.display = "flex";
  document.getElementById("hourly-wind").style.position = "relative";
  document.getElementById("hourly-temp").style.display = "none";
  document.getElementById("hourly-temp").style.position = "absolute";
  document.getElementById("hourly-prec").style.display = "none";
  document.getElementById("hourly-prec").style.position = "absolute";
}

function displayDailyForecast(response) {
  let daily = response.data.daily;
  let dailyForecast = document.querySelector(".daily-forecast");
  let dailyForecastHTML = "";
  daily.forEach(function (getDay, index) {
    if (index > 0) {
      dailyForecastHTML =
        dailyForecastHTML +
        `<div id="daily-forecast">
      <div>${formatDay(getDay.dt)}</div>
      <img src="media/weather-icons/${getDay.weather[0].icon}.svg" width="35"/>
      <div><span id="daily-temp-max">${Math.round(
        getDay.temp.max
      )}°</span>&nbsp;<span id="daily-temp-min">${Math.round(
          getDay.temp.min
        )}°</span></div>
      </div>`;
    }
  });
  dailyForecast.innerHTML = dailyForecastHTML;
}

defaultCity();

function inputLondon() {
  let popularCity = document.querySelector("#city");
  popularCity.innerHTML = "LONDON";

  let apiKey = `59a6ae41a8d53cb647a89df95d0d7348`;
  let apiUrlCity = `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${apiKey}`;

  celsius.classList.add("active");
  fahrenheit.classList.remove("active");

  axios.get(apiUrlCity).then(getCoords);
}

function inputParis() {
  let popularCity = document.querySelector("#city");
  popularCity.innerHTML = "PARIS";

  let apiKey = `59a6ae41a8d53cb647a89df95d0d7348`;
  let apiUrlCity = `https://api.openweathermap.org/data/2.5/weather?q=Paris&appid=${apiKey}`;

  celsius.classList.add("active");
  fahrenheit.classList.remove("active");

  axios.get(apiUrlCity).then(getCoords);
}

function inputMilan() {
  let popularCity = document.querySelector("#city");
  popularCity.innerHTML = "MILAN";

  let apiKey = `59a6ae41a8d53cb647a89df95d0d7348`;
  let apiUrlCity = `https://api.openweathermap.org/data/2.5/weather?q=Milan&appid=${apiKey}`;

  celsius.classList.add("active");
  fahrenheit.classList.remove("active");

  axios.get(apiUrlCity).then(getCoords);
}

function inputMadrid() {
  let popularCity = document.querySelector("#city");
  popularCity.innerHTML = "MADRID";

  let apiKey = `59a6ae41a8d53cb647a89df95d0d7348`;
  let apiUrlCity = `https://api.openweathermap.org/data/2.5/weather?q=Madrid&appid=${apiKey}`;

  celsius.classList.add("active");
  fahrenheit.classList.remove("active");

  axios.get(apiUrlCity).then(getCoords);
}

let form = document.querySelector("form");
form.addEventListener("submit", inputCity);
form.addEventListener("click", inputCity);

let current = document.querySelector("#current-button");
current.addEventListener("click", getPosition);

let popularCity1 = document.querySelector("#london");
popularCity1.addEventListener("click", inputLondon);

let popularCity2 = document.querySelector("#paris");
popularCity2.addEventListener("click", inputParis);

let popularCity3 = document.querySelector("#milan");
popularCity3.addEventListener("click", inputMilan);

let popularCity4 = document.querySelector("#madrid");
popularCity4.addEventListener("click", inputMadrid);

let tempBox = document.querySelector(".box3");
tempBox.addEventListener("click", showTemp);

let precBox = document.querySelector(".box4");
precBox.addEventListener("click", showPrec);

let windBox = document.querySelector(".box5");
windBox.addEventListener("click", showWind);

let currentSlide = 0;

function moveToRight() {
  if (currentSlide === 17) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }

  let slides = document.querySelectorAll("#hourly-forecast");
  slides.forEach(function (slide) {
    slide.style.transform = `translateX(${-100 * currentSlide}%)`;
  });
}

function moveToLeft() {
  if ((currentSlide = 1)) {
    currentSlide = 0;
  } else {
    currentSlide--;
  }

  let slides = document.querySelectorAll("#hourly-forecast");
  slides.forEach(function (slide) {
    slide.style.transform = `translateX(${-100 * currentSlide}%)`;
  });
}

let arrowNext = document.querySelector(".next");
arrowNext.addEventListener("click", moveToRight);

let arrowPrev = document.querySelector(".prev");
arrowPrev.addEventListener("click", moveToLeft);
