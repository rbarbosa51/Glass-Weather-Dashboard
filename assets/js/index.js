const searchButton = document.getElementById('searchButton');
const cityNameInput = document.getElementById('cityNameInput');
//Global Variables
let localHistory = [{}];
let currentCity = "";


const loadButtons = () => {
    //Guard against empty local Storage
    if (localStorage.getItem('history') === null) {
        console.log('Empty localStorage');
        return;
    }
    //Display and load localHistory
    //let tmpHistory = localStorage.getItem('history');
    localHistory = JSON.parse(localStorage.getItem('history'));
    console.log(localHistory.Age);
}
//Onload  get History
window.addEventListener('load', loadButtons);



//https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
//5e07344a4e6136949c3131603519df87
//http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
const getWeather = (city) => {
    //This fetch gets the coordinates
    currentCity = city;
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city},US&limit=1&appid=5e07344a4e6136949c3131603519df87`)
    .then( (res) => {
        return res.json();
    })
    .then ( (data) => {
        return data[0];
    })
    .then( (coord) => {
        //Converting to string with only 2 decimal positions 
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
        history.pushState

    })
    .catch( (e) => {
        console.log(e);
    })
}


window.onload = () => {
    console.log('Loaded');
}
searchButton.addEventListener('click', async (e) => {
    e.preventDefault();
    let inputCity = cityNameInput.value;
    console.log(`City Entered: ${inputCity}`);
    await getWeather(inputCity);
    
});