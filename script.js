console.log ("Am I online?");

//Declare a variable to store the searched city
var city="";
// variable declaration
var searchCity = $("#search-city");
var searchButton = $("#search-button");
var clearButton = $("#clear-history");
var currentCity = $("#current-city");
var currentTemperature = $("#temperature");
var currentHumidty= $("#humidity");
var currentWSpeed=$("#wind-speed");
var currentUvindex= $("#uv-index");
var sCity=[];

// searches the city to see if it exists in the entries from the storage
function find(c){
    for (var i=0; i<sCity.length; i++){
      if(c.toUpperCase()===sCity[i]){
        return -1;
      }
    }
    return 1;
  }
  
  //API key
  var APIKey="a0aca8a89948154a4182dcecc780b513";
  
  // Display the curent and future weather.
  function displayWeather(event){
    event.preventDefault();
    if(searchCity.val().trim()!==""){
      city=searchCity.val().trim();
      currentWeather(city);
    }
  }
  
  //AJAX Call
  function currentWeather(city){
  
    //URL so we can get a data from server
    var queryURL= "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + APIKey;
    $.ajax({
      url:queryURL,
      method:"GET",
    }).then(function(response){
  
      // Parse the response to display the current weather including the City Name, Date and the Weather Icon
      console.log(response);
  
      // Data Object from Server-Side-Api 
    var weathericon= response.weather[0].icon;
    var iconurl="https://openweathermap.org/img/wn/"+weathericon +"@2x.png";

    // Date Format
    var date=new Date(response.dt*1000).toLocaleDateString();

    //parse the response for name of city and concanatig the date and icon.
    $(currentCity).html(response.name +"("+date+")" + "<img src="+iconurl+">");

    // parse the response to display the current temperature.

    // Convert the Temperature to Fahrenheit
    var tempF = (response.main.temp - 273.15) * 1.80 + 32;
    $(currentTemperature).html((tempF).toFixed(2)+"&#8457");

    // Display the Humidity
    $(currentHumidty).html(response.main.humidity+"%");

    //Display Wind speed and convert to MPH
    var ws=response.wind.speed;
    var windsmph=(ws*2.237).toFixed(1);
    $(currentWSpeed).html(windsmph+"MPH");

    // Display UVIndex.
    //By Geographic coordinates method and using appid and coordinates as a parameter we are going build our uv query url inside the function below.

    UVIndex(response.coord.lon,response.coord.lat);
    forecast(response.id);
    if(response.cod==200){
      sCity=JSON.parse(localStorage.getItem("cityname"));
      console.log(sCity);
      if (sCity==null){
        sCity=[];
        sCity.push(city.toUpperCase()
        );
        localStorage.setItem("cityname",JSON.stringify(sCity));
        addToList(city);
      }
      else {
        if(find(city)>0){
          sCity.push(city.toUpperCase());
          localStorage.setItem("cityname",JSON.stringify(sCity));
          addToList(city);
        }
      }
    }
  });
}

  // This function returns the UVIindex response.
function UVIndex(ln,lt){

  // Url for uvindex.
  var uvqURL="https://api.openweathermap.org/data/2.5/uvi?appid="+ APIKey+"&lat="+lt+"&lon="+ln;
  $.ajax({
      url:uvqURL,
      method:"GET"
      }).then(function(response){
        $(currentUvindex).html(response.value);
      });
}
