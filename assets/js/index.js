const searchButton = document.getElementById('searchButton');
const cityNameInput = document.getElementById('cityNameInput');


//https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
//5e07344a4e6136949c3131603519df87
//http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
const getCoordinates = (city) => {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=5e07344a4e6136949c3131603519df87`)
    .then( (res) => {
        return res.json();
    })
    .then ( (data) => {
        console.log(data);
        console.log(`${city}: Lat: ${data[0].lat}, Lon: ${data[0].lon}`)
    })
    .catch( (e) => {
        console.log(e);
    })
}
searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    //Get city's Lat Long
    //Get weather
    let inputCity = cityNameInput.value;
    console.log(`City Entered: ${inputCity}`);
    getCoordinates(inputCity);
});