var cityName = "";
var citiesUsed = [];
var clickedCityEl = document.getElementById("city-submit");
var inputCity= document.getElementById("inputCity");
var cityHistory = document.getElementById("cityHistory");
var currentWeatherEl = document.getElementById("current-weather");
var forecastEl = document.getElementById("fiveday");
var date = moment().format("MMMM Do, YYYY");
var checkStorage = JSON.parse(localStorage.getItem("used cities"));

//submit button
clickedCityEl.addEventListener("click", function (event) {
    event.preventDefault();

    var submittedCity = document.getElementById("searched-city").value.trim().toLowerCase();

 

    cityName = submittedCity;
    
    runData();

});

//creates item for past submitted cities
var createCity = function () {


    var addingCity = document.createElement("li");
    addingCity.className = "card previous";
    addingCity.id = cityName.toLowerCase();
    addingCity.textContent = cityName;
    cityHistory.appendChild(addingCity);

    addingCity.addEventListener("click", function (event) {
        event.preventDefault();
        cityName = event.target.textContent
        //passes false to the argument so it doesnt create a new li
        runData(false)
    });

}

var runData = function (card) {
     console.log(cityName);
   
    var currentWeather = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=1722b5c6bb4fa782ea822037441e1e2b"
     console.log(currentWeather);
    fetch(currentWeather).then(function (response) {
        if (response.ok) {
            if (card == true && !citiesUsed.includes(cityName)) {
                //push name into an array and then into local storage
                citiesUsed.push(cityName);
                localStorage.setitem("used cities", JSON.stringify(citiesUsed));
                createCity();
            }
            //resets both the current weather and forecast div
            currentWeatherEl.innerHTML = "";
            forecastEl.innerHTML = "";
            //create div current weather and append it with info to page
            var currentCard = document.createElement("div");
            currentCard.className = "card align-center card-style";
            response.json().then(function (data) {

                var cardName = document.createElement("div");
                cardName.innerHTML = "<h2 class='card-title'>Current Weather</h2><div class='breadcrumb-item justify-center'><h3>" + data.name + ":<span> " + date + "</span>" + "</h3>" +
                    "<img class='shadow' src='http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png' /></div>" +
                    "<p> Temperature: " + data.main.temp + "°F</p>" +
                    "<p> Humidity: " + data.main.humidity + "%</p>"
                "<p> Wind Speed: " + data.wind.speed.toFixed(1) + "MPH </p>";
                currentCard.appendChild(cardName);


                currentWeatherEl.appendChild(currentCard);

                forecastEl.innerHTML = "<div class='card card-style'>" +
                    "<h2 class = 'card-title align-center'> Five Day Forecast</h2>" +
                    "<ul id= 'forecast-list' class = 'row'></ul>" +
                    "</div>"


            })
                .then(function (forecastresponse) {
                    forecastresponse.JSON().then(forecastdata)
                                                  { 
                        var forecastDaily = forecastdata.daily;
                        // 0 is today so start at 1 for the next day
                        for (var i = 1; i < 6; i++) {
                            //use dt (unix time) to populate the date
                            var forecastDateDay = moment.unix(forecastdata.daily[i].dt).format("MM/DD/YYYY")
                            //create each days weather forecast
                            var forecast = document.createElement("l1")
                            forecast.className = "card col-12 col-xl-2 bg-primary forecast padding-bottom"
                            forecast.innerHTML = "<p class='text-light'>" + forecastDateDay + "</p>" +
                                "<img class= 'shadow forecast-image mx-auto d-block' src='http://openweathermap.org/img/wn/'" + forecastDaily[i].weather[0].icon + "@2x.png' />" +
                                "<p class = 'text-light'>Temp: " + forecastDaily[i].temp.max.toFixed(2) + "°F</p>" +
                                "<p class= 'text-light'>Humidity: " + Math.round(forecastDaily[i].humidity) + "%</p>";
                            document.getElementById("forecast-list").appendChild(forecast);


                        }
                    }

                })
        }else{
            alert("name not found \nplease try again.");
            inputCity.reset();
            return false;
            
        }
    });
    
}
//grab items from localstorage and populate them on past search history
var oldSearchHistory = function(){
    if (!checkStorage){
        return;
    }else{
        localStorage.clear();
        for (var i= 0; i <checkStorage.length; i++){
            citiesUsed.push(checkStorage[i]);
            createCity(cityName);

        }
        // puts all items made in for loop into localStorage
        localStorage.setItem("used cities", JSON.stringify(citiesUsed));
    }
}

oldSearchHistory();

