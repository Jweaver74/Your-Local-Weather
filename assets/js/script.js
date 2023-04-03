var cities =[];
var cityFormEl = document.querySelector("#city-search-form");
var cityInputEl = document.querySelector("#city");
var weatherContainerEl = document.querySelector("#current-weather-container");
var citySearchInputEl = document.querySelector("#searched-city");
var forecastTitle = document.querySelector("#forecast");
var forecastContainerEl = document.querySelector("#five-day-container");
var pastSearchButtonEl = document.querySelector("#past-search-buttons");

var formSubmitHandler = function(event) {
    event.preventDefault();
    var city = cityInputEl.value.trim();
    if (city) {
        getCityWeather(city);
        get5day(city);
        cities.unshift({city});
        cityInputEl.value = "";
    }else{
        alert("Please enter a City");
    }
    saveSearch();
    pastSearch(city);
}
//console.log("hello")
var saveSearch = function() {
    localStorage.setItem("cities", JSON.stringify(cities));
};
// display weather to page
var getCityWeather = function(city) {
    var apiKey ="a827458cab2d028de7e99736a419597f"
    var apiURL =`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response) {
        response.json().then(function(data) {
            displayWeather(data, city);
        });
    });
};

var displayWeather = function(weather, searchCity) {
    weatherContainerElEl.textContent = "";
    citySearchInputEl.textContent = searchCity;
//date
    var currentDate = document.createElement("span");
    currentDate.textContent = " (" + dayjs(weather.dt.value).format("MMM D, YYYY") + ") ";
    citySearchInputEl.appendChild(currentDate);

    //image
    var weatherIcon = document.createElement("img");
    weatherIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + weather.weather[0].icon + ".png");
    citySearchInputEl.appendChild(weatherIcon);

    //temperature
    var temperatureEl = document.createElement("span");
    temperatureEl.textContent = "Temperature: " + weather.main.temp + " °F";
    temperatureEl.classList = "list-group-item"

    //humidity
    var humidityEl = document.createElement("span");
    humidityEl.textContent = "Humidity: " + weather.main.humidity + "%";
    humidityEl.classList = "list-group-item"

    //wind speed
    var windSpeedEl = document.createElement("span");
    windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
    windSpeedEl.classList = "list-group-item"

    weatherContainerEl.appendChild(temperatureEl);

    weatherContainerEl.appendChild(humidityEl);

    weatherContainerEl.appendChild(windSpeedEl);

    var lat = weather.coord.lat;
    var lon = weather.coord.lon;
    getUvIndex(lat, lon);

} 
//console.log("hello")

var getUvIndex = function(lat, lon) {
    var apiKey ="a827458cab2d028de7e99736a419597f"
    var apiURL =`https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`
    fetch(apiURL)
    .then(function(response) {
        response.json().then(function(data) {
            displayUvIndex(data);
        });
    });
};

var displayUvIndex = function(index) {
    var uvIndexEl = document.createElement("div");
    uvIndexEl.textContent = "UV Index: ";
    uvIndexEl.classList = "list-group-item"

    uvIndexValue = document.createElement("span");
    uvIndexValue.textContent = index.value;

    if (index.value <= 2) {
        uvIndexValue.classList = "favorable"
    }else if (index.value > 2 && index.value <= 8) {
        uvIndexValue.classList = "moderate"
    }else if (index.value > 8) {
        uvIndexValue.classList = "severe"
    }

    uvIndexEl.appendChild(uvIndexValue);

    weatherContainerEl.appendChild(uvIndexEl);
};

var get5day = function(city) {
    var apiKey ="a827458cab2d028de7e99736a419597f"
    var apiURL =`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`
    fetch(apiURL)
    .then(function(response) {  
        response.json().then(function(data) {
            display5day(data);
        });
    });
};

