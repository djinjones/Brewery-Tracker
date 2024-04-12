//We aren't quite sure of the total functionality behind our website, but there are a few things we can start doing.
//THINGS WE HAVE TO ADD:
//We need to get the data from the OpenBreweryDB API
//We need to ask the user for their current location
//THINGS WE CAN ADD BUT DONT HAVE TO:
//We could store breweries the user has already visited in the local storage
//We could store breweries the user wants to go to in the local storage
//We could could search for breweries near the user
//We could figure out how to use google maps api to calculate a time to get to the brewery
const searchForm = document.querySelector('#searchForm');
const searchBtn = document.querySelector('#searchBtn');
const searchBar = document.querySelector('#searchBar');
const selectField = document.querySelector('#selectField');


function getUserLocation() {
    // Check if Geolocation is supported
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by this browser.');
        return;
    }

    // Function to handle success in getting the location
    function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // Use latitude and longitude with Mapbox services here
        // e.g., showMap(latitude, longitude);
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        showMap(latitude, longitude);
        const currentCoords = [latitude, longitude];
        localStorage.setItem('coords', JSON.stringify(currentCoords));
    }

    // Function to handle error in getting the location
    function error() {
        alert('Unable to retrieve your location.');
    }

    // Make the request to get the user's location
    navigator.geolocation.getCurrentPosition(success, error);
}


function showMap(lat, lng) {
    mapboxgl.accessToken = 'pk.eyJ1IjoicmluamVlIiwiYSI6ImNsdXQ0ZWRjNjBvZTkybG85dTcxNjFudXgifQ.wuMqiIb0vQfJz3-r-ylGCA'; // Replace with your actual Mapbox API access token

    // Create a new map instance using Mapbox GL JS
    var map = new mapboxgl.Map({
        container: 'map', // The HTML element ID where you want the map to appear
        style: 'mapbox://styles/mapbox/streets-v11', // The style of the map you want to use
        center: [lng, lat], // Starting position [longitude, latitude]
        zoom: 12 // Starting zoom level
    });

    // Add navigation controls to the map (optional)
    map.addControl(new mapboxgl.NavigationControl());
}

// Usage:
getUserLocation();


function handleFormSubmit(event) {

    //We need to get the data from the form and send it through the fetch function
    event.preventDefault();
    let parameter = selectField.value;
    const searchValue = searchBar.value;
    parameter = `${parameter}=${searchValue}`
    fetchBreweryData(parameter);
}

function fetchBreweryData(parameter) {
    //We need to take the data inputed from the form and use it to search for breweies through the API
    const baseAPIurl = 'https://api.openbrewerydb.org/v1/breweries';
    const fetchUrl = `${baseAPIurl}?${parameter}&per_page=15`
    const coords = JSON.parse(localStorage.getItem('coords'))
    const longitude = coords[0];
    const latitude = coords[1];

    if (parameter=="by_dist") {
        async function fetchByDist() {
            try {
                const response = await fetch(`${baseAPIurl}?by_dist=${longitude},${latitude}&per_page=15`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                localStorage.setItem('brewery-data', JSON.stringify(data)); 
                console.log(data);
                appendBreweryData();
            } catch (error) {
                console.error('Error fetching brewery data:', error);
            }
        }
        fetchByDist();
    } else {

    async function fetchOpenBreweryDB() {
        try {
            const response = await fetch(fetchUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            localStorage.setItem('brewery-data', JSON.stringify(data)); 
            console.log(data);
            appendBreweryData();
        } catch (error) {
            console.error('Error fetching brewery data:', error);
        }
    }
    fetchOpenBreweryDB();
    
    }
}




function appendBreweryData() {
    const breweryBox = document.querySelector('#brewery-box');
    breweryBox.replaceChildren();
    
    const newDiv = document.createElement('div');
    const newTitle = document.createElement('h2');
    const newText = document.createElement('p');
    const newWebsiteUrl = document.createElement('p');
    const newLocation = document.createElement('p');
    const newLocationLink = document.createElement('a')
    const newLink = document.createElement('a');
    const breweryData = JSON.parse(localStorage.getItem('brewery-data'));
    const data = breweryData[0];

    newDiv.classList.add("breweryBox");
    newTitle.classList.add("breweryTitle", "custom-text");
    newText.classList.add("breweryText", "custom-text");
    newWebsiteUrl.classList.add("breweryUrl", "custom-text")
    newLink.classList.add("breweryLink", "custom-text");
    newLocation.classList.add("breryLocation", "custom-text");
    newLocationLink.classList.add("breweryLocationLink", "custom-text")

    newLink.textContent = "View website ";
    newLink.href = data.website_url;
    newTitle.textContent = data.name;
    newText.textContent = data.address_1 + " " + data.state + ", " + data.country;
    newLocationLink.textContent = "View Location ";
    newLocationLink.href = `api.mapbox.com/geocoding/v5/mapbox.places/peets.json?proximity=${data.longitude},${data.latitude}&access_token=<pk.eyJ1IjoicmluamVlIiwiYSI6ImNsdXQ0ZWRjNjBvZTkybG85dTcxNjFudXgifQ.wuMqiIb0vQfJz3-r-ylGCA/>`
    
    newDiv.append(newTitle, newText, newWebsiteUrl, newLink, newLocation, newLocationLink);
    breweryBox.append(newDiv);
    //We need to take the data we got from the fetch and append it to our HTML document
}






searchBtn.addEventListener('click', function(event){
    handleFormSubmit(event);
})

selectField.addEventListener('change', function(){
    const selectedOption = selectField.value;
        switch (selectedOption) {
            case 'by_name':
              searchBar.placeholder = 'Search by Name';
              break;
            case 'by_city':
              searchBar.placeholder = 'Search by City';
              break;
            case 'by_state':
              searchBar.placeholder = 'Search by State';
              break;

            default:
              searchBar.placeholder = 'Search by Name';
              break;
    }
})

searchBtn.addEventListener('click', function(event){
    handleFormSubmit(event);
});

// Attach the event listener to your button
document.getElementById('search-around-me-btn').addEventListener('click', function() {
    getUserLocation();
    let parameter = "by_dist"
    fetchBreweryData(parameter);
});



$(document).ready(function() {
    if ($('#map').length > 0) {
        console.log('Map container is ready.');
        getUserLocation();
    } else {
        console.log('Map container is not found.');
    }
});


