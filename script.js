// Variables from HTML

// Variables for Scripts
const todayDate = moment().format("MM/DD/YYYY");
const fDays = 5
const citiesDisplayed = JSON.parse(localStorage["searchHistory"]) || [
  "Las Vegas", "San Francisco", "Park City", "Tahoe", "Seattle", "Portland", "Honolulu", "Los Angeles"
];
localStorage["searchHistory"] = JSON.stringify(citiesDisplayed)
const citiesSearch = JSON.parse(localStorage["searchHistory"]);


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
$( document ).ready(function() {
  console.log( "ready!" );
  curCity = citiesDisplayed[0]
  getLocation(curCity);
  if (citiesSearch.length === 0) {
    for (let i = 0; i < citiesDisplayed.length; i++) {
      $(`#recent_city_btn_${i}`).html(citiesDisplayed[i]);    
    };
  }
  else {
    for (let i = 0; i < citiesSearch.length; i++) {
      $(`#recent_city_btn_${i}`).html(citiesSearch[i]);    
    };
  };  
});
// ENDED HERE NEED TO FIGURE OUT HOW TO ADD HISTORY TO LOCAL STORAGE
const adjustCities = function (curCity) {
  console.log(citiesDisplayed)
  function titleCase(string) {
    var sentence = string.toLowerCase().split(" ");
    for(var i = 0; i< sentence.length; i++){
       sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
    };
    sentence = sentence.join(' ')
    console.log(sentence)
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
    console.log(data);
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
  console.log(data)
  $('#ctemperature').text(data.current.temp + "° F")
  $('#chumidity').text(data.current.humidity + "%")
  $('#cwind_speed').text(data.current.wind_speed + " MPH")
  $('#cuv_index').text(data.current.uvi)
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

    // Need to add to storage so I can have the current cities lined up. Thinking of making an initial array that gets adjusted by the user
    // localStorage.setItem(`${currentIndex}`, currentAppoint);
});