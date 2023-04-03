var cities =[];
var cityFormEl = document.querySelector("#city-search-form");
var cityInputEl = document.querySelector("#city");
var weatherContainerEl = document.querySelector("#current-weather-container");
var citySearchInputEl = document.querySelector("#searched-city");
var forecastTitle = document.querySelector("#forecast");
var forecastContainerEl = document.querySelector("#fiveday-container");
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
    weatherContainerEl.textContent = "";
    citySearchInputEl.textContent = searchCity;
//date
    var currentDate = document.createElement("span");
    currentDate.textContent = " (" + dayjs.unix(weather.dt).format ("MMM D, YYYY") + ") ";
    citySearchInputEl.appendChild(currentDate);

    //image
    var weatherIcon = document.createElement("img");
    weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
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
//console.log("hello")

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

var display5day = function(weather) {
    forecastContainerEl.textContent = "";
    forecastTitle.textContent = "5-Day Forecast:";

    var forecast = weather.list;
    for(var i=5; i< forecast.length; i=i+8){
        var dailyForecast = forecast[i];
        
        var forecastEl = document.createElement("div");
        forecastEl.classList = "card bg-success text-light m-4";

       // console.log(dailyForecast)
       //date

     var forecastDate = document.createElement("h5");
        forecastDate.textContent = dayjs.unix(dailyForecast.dt).format("MMM D, YYYY");
        forecastDate.classList = "card-header text-center";
        forecastEl.appendChild(forecastDate);

        //image

        var weatherIcon = document.createElement("img");
        weatherIcon.classList = "card-body text-center";
        weatherIcon.setAttribute("src","https://openweathermap.org/img/wn/" + dailyForecast.weather[0].icon + ".png");
        forecastEl.appendChild(weatherIcon);

        //temperature
        var forecastTempEl = document.createElement("span");
        forecastTempEl.classList = "card-body text-center";
        forecastTempEl.textContent = dailyForecast.main.temp + " °F";
        forecastEl.appendChild(forecastTempEl);

        //humidity
        var forecastHumEl = document.createElement("span");
        forecastHumEl.classList = "card-body text-center";
        forecastHumEl.textContent = dailyForecast.main.humidity + "%";
        forecastEl.appendChild(forecastHumEl);

        forecastContainerEl.appendChild(forecastEl);
    }
};

var pastSearch = function(pastSearch) {
    pastSearchEl = document.createElement("button");
    pastSearchEl.textContent = pastSearch;
    pastSearchEl.classList = "d-flex w-100 btn-light border p-2";
    pastSearchEl.setAttribute("data-city", pastSearch);
    pastSearchEl.setAttribute("type", "submit");
    pastSearchButtonEl.prepend(pastSearchEl);
};

var pastSearchHandler = function(event) {
    var city = event.target.getAttribute("data-city");
    if (city) {
        getCityWeather(city);
        get5day(city);
    }
};


cityFormEl.addEventListener("submit", formSubmitHandler);
pastSearchButtonEl.addEventListener("click", pastSearchHandler);




