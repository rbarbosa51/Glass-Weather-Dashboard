const searchButton = document.getElementById('searchButton');
const cityNameInput = document.getElementById('cityNameInput');
const historyButtons = document.getElementById('historyButtons');
//Global Variables
let localHistory = [];
let currentCity = "";

//let parsedHistory = JSON.parse(localStorage.getItem('history'));

const loadButtons = () => {
    //Guard against empty local Storage
    if (localStorage.getItem('history') === null) {
        console.log('Empty localStorage');
        return;
    }
    let parsedHistory = JSON.parse(localStorage.getItem('history'));
    parsedHistory.forEach( (element) => {
        const tmpButton = document.createElement('button');
        tmpButton.setAttribute('id', element.city);
        tmpButton.classList.add('buttons');
        tmpButton.innerText = element.city;
        historyButtons.appendChild(tmpButton);
        localHistory.push({city: element.city});
    });
    console.log(`Contents of localStorage: ${JSON.stringify(parsedHistory)}`);
    console.log(`Contents of localHistory: ${JSON.stringify(localHistory)}`)

}
//Onload  get History
window.addEventListener('load', loadButtons);




/*
> let historyTmp = [];

> historyTmp.push({name:'Austin'});
> historyTmp.push({name:'New York'});
> localStorage.setItem('history2', JSON.stringify(historyTmp));
> let data = localStorage.getItem('history2');

< "[{\"name\":\"Austin\"},{\"name\":\"New York\"}]"
> let NewArray = JSON.parse(data);

> NewArray
< [{name: "Austin"}, {name: "New York"}] (2)

> NewArray[0].name;
< "Austin"
> NewArray[1].name;
< "New York"

*/





//Update the info on localStorage
const updateLocalStorage = () => {
    //Guard against duplicate values (making them lowercase):
    let duplicate = false;
    localHistory.forEach( (element) => {
        if (element.city.toLowerCase() === currentCity.toLowerCase()) {
            console.log('Duplicate Found');
            duplicate = true;
            currentCity = '';
            return
        }
    });
    
    /*if (localStorage.getItem('history') == null) {
        localHistory.push({city: currentCity});
        localStorage.setItem('history', JSON.stringify(localHistory));
        currentCity = '';
    } else {

    }*/
    localHistory.push({city: currentCity});
    localStorage.setItem('history', JSON.stringify(localHistory));
    currentCity = '';
    //localHistory.push({city: currentCity});
    //localStorage.setItem('history', JSON.stringify(localHistory));
    /*let tmpHistory = [];
    const ItemReceived = localStorage.getItem('history');
    if (ItemReceived === null) {
        localStorage.setItem('history', JSON.stringify({city: currentCity}));
        console.log('Wrote to localStorage');
    } else {
        
    }/*
    
    currentCity = '';
    //1) Check if there is actual data on localStorage


    // Is this needed

    /*if (localStorage.getItem('history') === null) {
        //If there is no value then set the current city in local storage
        //---->>>

        // Remember to use storeage events
        
        //localStorage.setItem('history', currentCity);
        //cont tempStr = JSON.stringify({})
        currentCity = '';
    } else {
        let tmpData = localStorage.getItem('history');
        let tmpArray = tmpData.split(' ');
        tmpArray.forEach( (element, index) => {
            console.log(element);
        })
        console.log(`This is the tmpData ${tmpData}`);
        //localHistory.push

        //currentCity = '';
    }*/
}

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
        updateLocalStorage();
        console.log('After updateLocalStorage');

    })
    .catch( (e) => {
        console.log(e);
    })
}


/*window.onload = () => {
    console.log('Loaded');
}*/
searchButton.addEventListener('click', async (e) => {
    e.preventDefault();
    let inputCity = cityNameInput.value;
    if (inputCity === '') {
        console.error("Enter a city Name");
        return;
    }
    console.log(`City Entered: ${inputCity}`);
    await getWeather(inputCity);
    
});