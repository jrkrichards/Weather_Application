// Variables for Scripts
const todayDate = moment().format("MM/DD/YYYY");
const fDays = 5

// Retrieving APIs
const getLocation = function (curCity) {
  let apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + curCity + "&appid=cea0780ed46e50fd874ab4dafb30678d&units=imperial";

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          getCoordinates(data, curCity);
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to Open Weather');
    });
};

const getCurrentWeather = function (curCityLat, curCityLon) {
    let apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + curCityLat + "&lon=" + curCityLon + "&appid=cea0780ed46e50fd874ab4dafb30678d&units=imperial";
  
    fetch(apiUrl)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            displayWeather(data);
            displayForecast(data);
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to connect to Open Weather');
      });
  };

// Functions
// Function to set up the application. This function checks if there is anything saved in localStorage. If there is then it will use what is in localStorage. If there isn't then it will default to the "startCities" array.
$( document ).ready(function() {
  let startCities = [
    "Las Vegas", "San Francisco", "Park City", "Tahoe", "Seattle", "Portland", "Honolulu", "Los Angeles"
  ];
  if (window.localStorage.length === 0) {
    curCity = startCities[0];
    getLocation(curCity);
    for (let i = 0; i < startCities.length; i++) {
      localStorage["searchHistory"] = JSON.stringify(startCities)
      $(`#recent_city_btn_${i}`).html(startCities[i]);    
    };
  }
  else {
    const citiesSearch = JSON.parse(localStorage["searchHistory"]);
    curCity = citiesSearch[0];
    getLocation(curCity);
    for (let i = 0; i < citiesSearch.length; i++) {
      $(`#recent_city_btn_${i}`).html(citiesSearch[i]);    
    };
  };  
});

// Function to adjust the localStorage array for saved cities. This function also ensures the cities are in title case.
const adjustCities = function (curCity) {
  const citiesDisplayed = JSON.parse(localStorage["searchHistory"])
  function titleCase(string) {
    var sentence = string.toLowerCase().split(" ");
    for(var i = 0; i< sentence.length; i++){
       sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
    };
    sentence = sentence.join(' ')
    citiesDisplayed.splice(0, 0, sentence)
    return sentence;
  }
  titleCase(curCity)
  citiesDisplayed.pop()
  localStorage["searchHistory"] = JSON.stringify(citiesDisplayed)
  for (let i = 0; i < citiesDisplayed.length; i++) {
    $(`#recent_city_btn_${i}`).html(citiesDisplayed[i]);   
  };
  $("#city_input").html("")
};

const getCoordinates = function (data, curCity) {
    let curCityLat = data.coord.lat;
    let curCityLon = data.coord.lon;
    let iconcode = data.weather[0].icon;
    let iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
    var cityNameUse = data.name
    getCurrentWeather(curCityLat, curCityLon);
    $('#city_name').text(data.name + " (" + todayDate + ")");
    $('#cwicon').attr("src", iconurl);

}

const displayWeather = function (data) {
  $('#ctemperature').text(data.current.temp + "° F")
  $('#chumidity').text(data.current.humidity + "%")
  $('#cwind_speed').text(data.current.wind_speed + " MPH")
  $('#cuv_index').text(data.current.uvi)
  if(data.current.uvi >= 6) {
    $('#cuv_index').css('background-color', 'red')
    $('#cuv_index').css('color', 'white')
  }
  else if (data.current.uvi >= 3) {
    $('#cuv_index').css('background-color', '#CCCC00')
    $('#cuv_index').css('color', 'white')
  }
  else {
    $('#cuv_index').css('background-color', 'green')
    $('#cuv_index').css('color', 'white')
  }
}

const displayForecast = function (data) {
  for (let i = 0; i < fDays; i++) {
    let iconcode = data.daily[i].weather[0].icon;
    let iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
    let fAddDays = i + 1
    let fDay = moment(todayDate, "MM/DD/YYYY").add(fAddDays, 'd').format("MM/DD/YYYY");
    $(`#forecast_${i}_title`).text(fDay);
    $(`#forecast_${i}_img`).attr('src', iconurl);
    $(`#forecast_${i}_temp`).text(data.daily[i].temp.day + "° F");
    $(`#forecast_${i}_hum`).text(data.daily[i].humidity + "%");
  }
}

// EventListeners
$(":button").click(function (event) {
    event.preventDefault();
    let currentId = $(this).attr("id");
    if(currentId === "search_button") {
        var curCity = $("#city_input").val();
        adjustCities(curCity);
    }
    else {
        var curCity = $(this).html();
    }
    getLocation(curCity);
});