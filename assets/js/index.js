const searchButton = document.getElementById('searchButton');
const cityNameInput = document.getElementById('cityNameInput');
//Global Variables
let history = [];
let currentWeather = [];

//https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
//5e07344a4e6136949c3131603519df87
//http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
const getWeather = (city) => {
    //This fetch gets the coordinates
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city},US&limit=1&appid=5e07344a4e6136949c3131603519df87`)
    .then( (res) => {
        return res.json();
    })
    .then ( (data) => {
        return data[0];
    })
    .then( (coord) => {
        let lat = coord.lat.toFixed(2);
        let lon = coord.lon.toFixed(2);
        console.log(`Lat: ${lat} and Lon: ${lon}`);
        //This nested fetch gets the actual weather data
        return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=5e07344a4e6136949c3131603519df87`)

    })
    .then( (res) => {
        return res.json();
    })
    .then( (data) => {
        console.log(data);
    })
    .catch( (e) => {
        console.log(e);
    })
}

searchButton.addEventListener('click', async (e) => {
    e.preventDefault();
    //Get city's Lat Long
    //Get weather
    let inputCity = cityNameInput.value;
    console.log(`City Entered: ${inputCity}`);
    let coordinates = await getWeather(inputCity);
    
});