const API_KEY = "API_KEY"; //API KEY

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const gpsBtn = document.getElementById("gpsBtn");
const suggestionsBox = document.getElementById("suggestions");
const statusEl = document.getElementById("status");

const cityEl = document.getElementById("city");
const tempEl = document.getElementById("temp");
const conditionEl = document.getElementById("condition");
const feelsEl = document.getElementById("feels");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const pressureEl = document.getElementById("pressure");

/* BASIC CITY LIST CAN ADD MORE*/
const cities = [
  "Mumbai","Pune","Delhi","Bangalore","Hyderabad","Chennai",
  "Kolkata","Jaipur","Ahmedabad","Nagpur","Indore","Bhopal","Kolhapur","Bhandara"
];

function updateUI(data) {
  cityEl.textContent = `${data.name}, ${data.sys.country}`;
  tempEl.textContent = `${Math.round(data.main.temp)}°C`;
  conditionEl.textContent = data.weather[0].description;
  feelsEl.textContent = `${Math.round(data.main.feels_like)}°C`;
  humidityEl.textContent = `${data.main.humidity}%`;
  windEl.textContent = `${data.wind.speed} m/s`;
  pressureEl.textContent = `${data.main.pressure} hPa`;
  statusEl.textContent = "";
}

async function fetchWeather(url) {
  try {
    statusEl.textContent = "Loading weather...";
    const res = await fetch(url);
    if (!res.ok) throw new Error();
    const data = await res.json();
    updateUI(data);
  } catch {
    statusEl.textContent = "Unable to fetch weather data.";
  }
}

/* CITY SEARCH */
searchBtn.onclick = () => {
  if (!cityInput.value.trim()) return;
  fetchWeather(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&units=metric&appid=${API_KEY}`
  );
  suggestionsBox.style.display = "none";
};

/* GPS */
gpsBtn.onclick = () => {
  if (!navigator.geolocation) {
    statusEl.textContent = "Geolocation not supported.";
    return;
  }

  statusEl.textContent = "Fetching location...";
  navigator.geolocation.getCurrentPosition(pos => {
    fetchWeather(
      `https://api.openweathermap.org/data/2.5/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&units=metric&appid=${API_KEY}`
    );
  });
};

/* AUTOCOMPLETE */
cityInput.addEventListener("input", () => {
  const query = cityInput.value.toLowerCase();
  suggestionsBox.innerHTML = "";

  if (!query) {
    suggestionsBox.style.display = "none";
    return;
  }

  const matches = cities.filter(city =>
    city.toLowerCase().startsWith(query)
  );

  if (!matches.length) {
    suggestionsBox.style.display = "none";
    return;
  }

  matches.forEach(city => {
    const div = document.createElement("div");
    div.textContent = city;
    div.onclick = () => {
      cityInput.value = city;
      suggestionsBox.style.display = "none";
      searchBtn.click();
    };
    suggestionsBox.appendChild(div);
  });

  suggestionsBox.style.display = "block";
});

document.addEventListener("click", e => {
  if (!e.target.closest(".search-section")) {
    suggestionsBox.style.display = "none";
  }
});

