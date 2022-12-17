const searchButton = document.getElementById('searchButton');
const cityNameInput = document.getElementById('cityNameInput');
const historyButtons = document.getElementById('historyButtons');
//Global Variables


//let localHistory = [];
let currentCity = "";
/*
<div id="f1Date">Placeholder</div>
                        <div id="f1Icon"></div>
                        <div id="f1Temp">Temp:</div>
                        <div id="f1Wind">Wind:</div>
                        <div id="f1Humidity">Humidity</div>
*/
const clearUI = () => {
    const mCity =document.getElementById('f0City');
    mCity.innerText = "Placeholder City";
    for (let i = 0; i <=5; i++) {
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

const populateUI = (data) => {
    console.log('Populate UI');
}
//https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
//5e07344a4e6136949c3131603519df87
//http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
const getWeather = (city) => {
    //This fetch gets the coordinates
    currentCity = city;
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=5e07344a4e6136949c3131603519df87`)
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
        console.log(data.cod);
        console.log(`${data.list[0].main.temp}`);
        updateLocalStorage();
        cityNameInput.value = '';

    })
    .catch( (e) => {
        //To do:  Better Not a City Handling ????
        //console.log(e);
        alert(e);
        window.location.reload();
    })
}


/*window.onload = () => {
    console.log('Loaded');
}*/
searchButton.addEventListener('click', async (e) => {
    e.preventDefault();
    let inputCity = cityNameInput.value;
    if (inputCity === '') {
        console.log("Enter a city Name");
        return;
    }
    console.log(`City Entered: ${inputCity}`);
    //Disable all buttons
    let buttonArray = document.querySelectorAll('button');
    buttonArray.forEach( (btn) => {
        btn.disabled = true;
    })
    await getWeather(inputCity);
    
    
});