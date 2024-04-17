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
const previousBtn = document.querySelector('#previousBtn')
const nextBtn = document.querySelector('#nextBtn')
let map;

function initializeMap() {
    if (map) return; // Ensure the map is only initialized once

    mapboxgl.accessToken = 'pk.eyJ1IjoicmluamVlIiwiYSI6ImNsdXQ0ZWRjNjBvZTkybG85dTcxNjFudXgifQ.wuMqiIb0vQfJz3-r-ylGCA';
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        zoom: 12 // Initial zoom level
    });

    map.on('load', function() {
        setupMapControls();
        getUserLocation(); // Fetch user location and update map
    });
}

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            setInitialMapPosition(latitude, longitude); // Update map position
            fetchBreweriesNearLocation(latitude, longitude, map); // Optional: fetch nearby breweries
        }, function(error) {
            console.error("Error getting the user's location: ", error);
            alert('Unable to retrieve your location.');
        });
    } else {
        alert('Geolocation is not supported by your browser.');
    }
}

function setInitialMapPosition(lat, lng) {
    map.flyTo({ center: [lng, lat], zoom: 12 });
}
// Add map controls like navigation controls and directions
function setupMapControls() {
    map.addControl(new mapboxgl.NavigationControl());
    map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showUserLocation: true
    }), 'top-right');
}

// Fetch and display breweries near a location
function displayBreweriesOnMap(breweries, map) {
    breweries.forEach(brewery => {
        if (brewery.latitude && brewery.longitude) {
            const popupContent = `
                <strong>${brewery.name}</strong><br>
                <a href="${brewery.website_url}" target="_blank">Visit Website</a><br>
                <button class="get-directions-btn" data-lat="${brewery.latitude}" data-lng="${brewery.longitude}">Get Directions</button>
            `;
            new mapboxgl.Marker()
                .setLngLat([brewery.longitude, brewery.latitude])
                .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent))
                .addTo(map);
        }
    });
      // Attach event listeners after map and markers are rendered
      attachDirectionEventListeners(map);
    }

function attachDirectionEventListeners(map) {
        // Use event delegation to handle clicks on any 'get-directions-btn' within the map
        map.getContainer().addEventListener('click', function(event) {
            if (event.target.classList.contains('get-directions-btn')) {
                const lat = parseFloat(event.target.getAttribute('data-lat'));
                const lng = parseFloat(event.target.getAttribute('data-lng'));
                getDirections(lat, lng);
            }
        });
    }
// Function to handle direction requests (assumes you have a setup to handle directions)
function getDirections(lat, lng) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const startLat = position.coords.latitude;
            const startLng = position.coords.longitude;
            const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${startLat},${startLng}&destination=${lat},${lng}&travelmode=driving`;
            window.open(googleMapsUrl, '_blank');
        }, function(error) {
            console.error("Error getting the user's location: ", error);
            alert('Error getting location. Please ensure location services are enabled.');
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}





// Example of fetching breweries based on a query
function fetchBreweriesNearLocation(latitude, longitude, map) {
    // Define the API endpoint with parameters for latitude, longitude, and number of results per page
    const url = `https://api.openbrewerydb.org/breweries?by_dist=${latitude},${longitude}&per_page=10`;

    // Fetch the breweries from the API
    fetch(url)
        .then(response => response.json())
        .then(breweries => {
            console.log("Breweries near this location: ", breweries);
            displayBreweriesOnMap(breweries, map);
        })
        .catch(error => console.error('Error fetching breweries:', error));
}



// Initialization
document.addEventListener('DOMContentLoaded', initializeMap);

function handleFormSubmit(event) {

    //We need to get the data from the form and send it through the fetch function
    event.preventDefault();
    let parameter = selectField.value;
    const searchValue = searchBar.value;
    parameter = `${parameter}=${searchValue}`
    localStorage.setItem('currentIndex', 0)
    searchBar.value='';
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
    appendBreweryData();
    }
}
// function fetchBreweryData(parameter) {

//     const baseAPIurl = 'https://api.openbrewerydb.org/breweries';
//     const fetchUrl = `${baseAPIurl}?${parameter}&per_page=15`;

//     fetch(fetchUrl)
//         .then(response => {
//             if (!response.ok) throw new Error('Failed to fetch breweries');
//             return response.json();
//         })
//         .then(data => {
//             console.log('Fetched data:', data);
//             localStorage.setItem('brewery-data', JSON.stringify(data));
//         });
//     }
function appendBreweryData() {
    //We need to take the data we got from the fetch and append it to our HTML document
    const breweryBox = document.querySelector('#brewery-box');
    breweryBox.replaceChildren();
    const breweryData = JSON.parse(localStorage.getItem('brewery-data'));
    let index = 0
    if (localStorage.getItem('currentIndex')) {
        index = localStorage.getItem('currentIndex');
    }
    
    const newDiv = document.createElement('div');
    const newTitle = document.createElement('h');
    const newAddress = document.createElement('p');
    const newAddress2 = document.createElement('p')
    const newWebsiteUrl = document.createElement('p');
    const newLocation = document.createElement('p');
    const newLocationLink = document.createElement('a')
    const newLink = document.createElement('a');
    
    const data = breweryData[index];

    newDiv.classList.add("breweryBox");
    newTitle.classList.add("breweryTitle", "custom-text");
    newAddress.classList.add("breweryText", "custom-text");
    newAddress.classList.add("breweryText", "custom-text");
    newAddress2.classList.add("breweryText", "custom-text")
    newWebsiteUrl.classList.add("breweryUrl", "custom-text");
    newLink.classList.add("breweryLink", "custom-text");
    newLocation.classList.add("breryLocation", "custom-text");
    newLocationLink.classList.add("breweryLocationLink", "custom-text");

    newLink.textContent = "View website ";
    newLink.href = data.website_url;
    newTitle.textContent = data.name;
    newAddress.textContent = data.address_1 
    newAddress2.textContent = data.city + " " + data.state + ", " + data.country + " " + data.postal_code + " ";
    newLocationLink.textContent = "View Location ";
    newLocationLink.href = `api.mapbox.com/geocoding/v5/mapbox.places/peets.json?proximity=${data.longitude},${data.latitude}&access_token=<pk.eyJ1IjoicmluamVlIiwiYSI6ImNsdXQ0ZWRjNjBvZTkybG85dTcxNjFudXgifQ.wuMqiIb0vQfJz3-r-ylGCA/>`;
    
    newDiv.append(newTitle, newAddress, newAddress2, newWebsiteUrl, newLink, newLocation, newLocationLink);
    breweryBox.append(newDiv);
    
}


previousBtn.addEventListener('click', function(event){
    event.preventDefault();
    let index = localStorage.getItem('currentIndex');
    index--;
    if (index<0){index = 0}
    else if (index>14){index = 14};
    localStorage.setItem('currentIndex', index);
    console.log(index);
    appendBreweryData();
});

nextBtn.addEventListener('click', function(event){
    event.preventDefault();
    let index = localStorage.getItem('currentIndex');
    index++;
    if (index<0){index = 0}
    else if (index>14){index = 14};
    localStorage.setItem('currentIndex', index);
    console.log(index);
    appendBreweryData();
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
});

searchBtn.addEventListener('click', function(event) {
    event.preventDefault();
    handleFormSubmit(event);
});
function setupEventListeners() {
    document.getElementById('search-around-me-btn').addEventListener('click', () => {
        getUserLocation();
    });
}

$(document).ready(function() {
    getUserLocation();
});