const searchButton = document.getElementById('searchButton');
const cityNameInput = document.getElementById('cityNameInput');
const historyButtons = document.getElementById('historyButtons');
//Global Variables

//https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}

//let localHistory = [];
let currentCity = "";
let lat;
let lon;

const clearUI = () => {
    const mCity = document.getElementById('cCity');
    mCity.innerText = "Placeholder City";
    const cDate = document.getElementById('cDate');
    cDate.innerText = "Date ";
    const cIcon = document.getElementById('cIcon');
    cIcon.innerText = '';
    const cTemp = document.getElementById('cTemp');
    cTemp.innerText = 'Temp: ';
    const cWind = document.getElementById('cWind');
    cWind.innerText = 'Wind: ';
    const cHumidity = document.getElementById('cHumidity');
    cHumidity.innerText = 'Humidity: ';
    for (let i = 0; i <=4; i++) {
        const tmpDate = document.getElementById(`f${i}Date`);
        tmpDate.innerText = ' Date';
        const tmpIcon = document.getElementById(`f${i}Icon`);
        tmpIcon.innerText = '';
        const tmpTemp = document.getElementById(`f${i}Temp`);
        tmpTemp.innerText = 'Temp:';
        const tmpWind = document.getElementById(`f${i}Wind`);
        tmpWind.innerText = 'Wind';
        const tmpHumidity = document.getElementById(`f${i}Humidity`);
        tmpHumidity.innerText = 'Humidity';
    }
}

const loadButtons = () => {
    //Guard against empty local Storage
    if (localStorage.getItem('history') === null) {
        console.log('Empty localStorage');
        return;
    }
    
    //Remove buttons if previously set
    const tmpButtons = document.querySelectorAll('.buttons');
    tmpButtons.forEach( (btn) => {
        btn.parentElement.removeChild(btn);
    });
    
    //Create Buttons
    let parsedHistory = JSON.parse(localStorage.getItem('history'));
    parsedHistory.forEach( (element) => {
        const tmpButton = document.createElement('button');
        tmpButton.setAttribute('id', element.city);
        tmpButton.classList.add('buttons');
        tmpButton.innerText = element.city;
        historyButtons.appendChild(tmpButton);
        
    });
    console.log(`Contents of localStorage: ${JSON.stringify(parsedHistory)}`);
    //Disable all buttons
    let btnArray = document.querySelectorAll('button');
    btnArray.forEach( (btn) => {
        btn.disabled = false;
    })

}
//Onload  get History
window.addEventListener('load', () => {
    clearUI();
    loadButtons()
});



//Update the info on localStorage
const updateLocalStorage = () => {
    //Guard against duplicate values (making them lowercase):
    let duplicate = false;
    let localHistory = [];
    let tmpHistory = JSON.parse(localStorage.getItem('history'));
    //If localStorage empty then tmpHistory will be null
    if (tmpHistory === null) {
        localHistory.push({city: currentCity});
        localStorage.setItem('history', JSON.stringify(localHistory));
        currentCity = '';
        loadButtons();
        return;
    }
    tmpHistory.forEach( (element) => {
        localHistory.push(element);
    })
    //Check for duplicate, if not duplicate then write to localStorage and reload buttons
    localHistory.forEach( (element) => {
        if (element.city.toLowerCase() === currentCity.toLowerCase()) {
            console.log('Duplicate Found');
            duplicate = true;
            currentCity = '';
            let buttonArray = document.querySelectorAll('button');
            buttonArray.forEach( (btn) => {
                btn.disabled = false;
            })
            return
        } 
    });
    if (!duplicate) {
        localHistory.push({city: currentCity});
            localStorage.setItem('history', JSON.stringify(localHistory));
            currentCity = '';
            //Reload Buttons
            loadButtons();
    }
}

const populateForecastUI = (data) => {
    console.log('Forecast Data: ');
    console.log(data);
    //const mCity = document.getElementById('f0City');
    //mCity.innerText = currentCity;
    for (let i = 0; i <=4; i++) {
        const tmpDate = document.getElementById(`f${i}Date`);
        tmpDate.innerText = (data.list[(i * 8 + 1)].dt_txt.split(' '))[0];
        const tmpIcon = document.getElementById(`f${i}Icon`);
        tmpIcon.innerText = '';
        const tmpTemp = document.getElementById(`f${i}Temp`);
        tmpTemp.innerText = `Temp: ${data.list[(i * 8 + 1)].main.temp}`;
        const tmpWind = document.getElementById(`f${i}Wind`);
        tmpWind.innerText = `Wind: ${data.list[(i * 8 + 1)].wind.speed}`;
        const tmpHumidity = document.getElementById(`f${i}Humidity`);
        tmpHumidity.innerText = `Humidity: ${data.list[(i * 8 + 1)].main.humidity}`;
    }

}
const populateCurrentUI = (data) => {
    console.log('Current Weather Data: ');
    console.log(data);

}
//This is the project's main function
const getWeather = (city) => {
    //This fetch gets the coordinates
    currentCity = city;
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&exclude=daily&appid=5e07344a4e6136949c3131603519df87`)
    .then( (res) => {
        return res.json();
    })
    .then ( (data) => {
        return data[0];
    })
    .then( (coord) => {
        //Converting to string with only 2 decimal positions 
        lat = coord.lat.toFixed(2);
        lon = coord.lon.toFixed(2);
        console.log(`Lat: ${lat} and Lon: ${lon}`);
        //This nested fetch gets the forecast weather data
        return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=5e07344a4e6136949c3131603519df87`);

    })
    .then( (res) => {
        return res.json();
    })
    .then( (data) => {
        populateForecastUI(data);
        updateLocalStorage();
        //This nested fetch gets the current Weather data
        return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=5e07344a4e6136949c3131603519df87`);

    })
    .then( (res) => {
        return res.json();
    })
    .then( (data) => {
        populateCurrentUI(data);
        cityNameInput.value = '';
    })
    .catch( (e) => {
        alert(e);
        window.location.reload();
    })
}


searchButton.addEventListener('click', async (e) => {
    e.preventDefault();
    let inputCity = cityNameInput.value;
    if (inputCity === '') {
        console.log("Enter a city Name");
        return;
    }
    //In the event that an actual city is entered, then we can begin by first clearing the UI
    clearUI();
    console.log(`City Entered: ${inputCity}`);
    //Disable all buttons
    let buttonArray = document.querySelectorAll('button');
    buttonArray.forEach( (btn) => {
        btn.disabled = true;
    })
    await getWeather(inputCity);
    
    
});