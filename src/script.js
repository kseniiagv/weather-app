let now = new Date();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day = days[now.getDay()];
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
  precipitation.innerHTML = response.data.hourly[now.getHours()].pop * 100;
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

defaultCity();

let form = document.querySelector("form");
form.addEventListener("submit", inputCity);
form.addEventListener("click", inputCity);

let current = document.querySelector("#current-button");
current.addEventListener("click", getPosition);
