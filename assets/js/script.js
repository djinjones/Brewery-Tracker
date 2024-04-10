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


function handleFormSubmit() {
    //We need to get the data from the form and send it through the fetch function
    fetchBreweryData(city, parameter);
    
}
function fetchBreweryData(city, parameter) {
    //We need to take the data inputed from the form and use it to search for breweies through the API
}

function appendBreweryData() {
    //We need to take the data we got from the fetch and append it to our HTML document
}

function addBreweryToChecklist() {
    //We need to add a specific brewery to a new list of breweries we want to visit (We dont have to do this if we dont like it)
}

function addBreweryToDonelist() {
    //We need to be able to move the brewery from the checklist to the donelist if we have already visited the brewery (We dont have to do this if we dont like it)
}



searchBtn.addEventListener('click', function(){
    handleFormSubmit();
});

// Attach the event listener to your button
document.getElementById('search-around-me-btn').addEventListener('click', function() {
    getUserLocation();
});

$(document).ready(function() {
    if ($('#map').length > 0) {
        console.log('Map container is ready.');
        getUserLocation();
    } else {
        console.log('Map container is not found.');
    }
});

