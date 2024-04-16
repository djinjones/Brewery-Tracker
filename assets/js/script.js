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
var map;

function getUserLocation(callback) {
    callback = callback || function(lat, lng) {
        console.log(`Default callback: Latitude ${lat}, Longitude ${lng}`);
    };

    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser.');
        return;
    }

    function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        console.log(typeof callback); // Should log 'function'
        if (typeof callback === 'function') {
            callback(latitude, longitude);
        } else {
            console.error('callback is not a function');
        }
    }

    function error() {
        alert('Unable to retrieve your location.');
    }

    navigator.geolocation.getCurrentPosition(success, error);
}

function initMapAndFetchBreweries() {
    getUserLocation((lat, lng) => {
        showMap(lat, lng);
        fetchBreweriesNearby(lat, lng);
    });
}

function showBreweriesOnMap(breweries, lat, lng) {
    // Assume `map` is globally accessible or passed into this function
    breweries.forEach(brewery => {
        if (brewery.latitude && brewery.longitude) {
            new mapboxgl.Marker()
                .setLngLat([parseFloat(brewery.longitude), parseFloat(brewery.latitude)])
                .setPopup(new mapboxgl.Popup().setText(`${brewery.name}`))
                .addTo(map);
        }
    });
}




function showMap(lat, lng) {
    if (map) return; //check if map is akready initialized
    mapboxgl.accessToken = 'pk.eyJ1IjoicmluamVlIiwiYSI6ImNsdXQ0ZWRjNjBvZTkybG85dTcxNjFudXgifQ.wuMqiIb0vQfJz3-r-ylGCA'; // Replace with your actual Mapbox API access token

    // Create a new map instance using Mapbox GL JS
    map = new mapboxgl.Map({
        container: 'map', // The HTML element ID where you want the map to appear
        style: 'mapbox://styles/mapbox/streets-v11', // The style of the map you want to use
        center: [lng, lat], // Starting position [longitude, latitude]
        zoom: 12 // Starting zoom level
    });
    map.on('load', function() {
        console.log("Map loaded:", map);  // Check if map is correctly initialized here
        addMapControls();  // Add controls after the map is loaded
        map.addSource('points', {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: [{
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [lng, lat]  // Example coordinates
                    },
                    properties: {
                        title: 'Mapbox DC',
                        icon: 'beer-11'
                    }
                }]
            }
        });
    
        // Add a layer to use the image to represent the data
        map.addLayer({
            id: 'points',
            type: 'symbol',
            source: 'points',
            layout: {
                'icon-image': '{icon}',  // Use the property 'icon' from the source's features
                'icon-size': 1.5
            }
        });
    });
}


function addMapControls() {
    console.log(map); // Should not be undefined if everything is correct

    var directions = new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        unit: 'metric',
        profile: 'mapbox/driving'
    });

    if (!map) {
        console.error('Map is not initialized.');
        return;
    }

    map.addControl(directions, 'top-left');
    map.addControl(new mapboxgl.NavigationControl());
}


function fetchBreweriesNearby(lat, lng) {
    const fetchUrl = `https://api.openbrewerydb.org/breweries?by_dist=${lat},${lng}&per_page=10`;
    fetch(fetchUrl)
        .then(response => response.json())
        .then(breweries => {
            console.log("Received breweries:", breweries);
            if (breweries.length > 0) {
                breweries.forEach(brewery => {
                    if (brewery.latitude && brewery.longitude) {
                        new mapboxgl.Marker({
                            // element: createMarkerElement('beer-11'),
                            color: "#FF6347"
                        })
                        .setLngLat([brewery.longitude, brewery.latitude])
                        .setPopup(new mapboxgl.Popup().setText(`${brewery.name} - ${brewery.type}`))
                        .addTo(map);
                    }
                });
            } else {
                console.log('No breweries found near this location.');
            }
        })
        .catch(error => console.error('Error fetching breweries:', error));
}

function createMarkerElement(iconName) {
    const el = document.createElement('div');
    el.className = 'marker';
    el.style.backgroundImage = `url('mapbox://styles/mapbox/streets-v11/maki_icons/${iconName}.png')`;
    el.style.width = '30px';
    el.style.height = '30px';
    return el;
}



function handleFormSubmit(event) {

    //We need to get the data from the form and send it through the fetch function
    event.preventDefault();
    let parameter = selectField.value;
    const searchValue = searchBar.value;
    parameter = `${parameter}=${searchValue}`
    fetchBreweryData(parameter);
}

// function fetchBreweryData(parameter) {
//     //We need to take the data inputed from the form and use it to search for breweies through the API
//     const baseAPIurl = 'https://api.openbrewerydb.org/v1/breweries';
//     const fetchUrl = `${baseAPIurl}?${parameter}&per_page=15`
//     const coords = JSON.parse(localStorage.getItem('coords'))
//     const longitude = coords[0];
//     const latitude = coords[1];

//     if (parameter=="by_dist") {
//         async function fetchByDist() {
//             try {
//                 const response = await fetch(`${baseAPIurl}?by_dist=${longitude},${latitude}&per_page=15`);
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }
//                 const data = await response.json();
//                 localStorage.setItem('brewery-data', JSON.stringify(data)); 
//                 console.log(data);
//                 appendBreweryData();
//             } catch (error) {
//                 console.error('Error fetching brewery data:', error);
//             }
//         }
//         fetchByDist();
//     } else {

//     async function fetchOpenBreweryDB() {
//         try {
//             const response = await fetch(fetchUrl);
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             const data = await response.json();
//             localStorage.setItem('brewery-data', JSON.stringify(data)); 
//             console.log(data);
//             appendBreweryData();
//         } catch (error) {
//             console.error('Error fetching brewery data:', error);
//         }
//     }
//     fetchOpenBreweryDB();
    
//     }
// }
function fetchBreweryData(parameter) {
    const baseAPIurl = 'https://api.openbrewerydb.org/breweries';
    const fetchUrl = `${baseAPIurl}?${parameter}&per_page=15`;

    fetch(fetchUrl)
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch breweries');
            return response.json();
        })
        .then(data => {
            console.log('Fetched data:', data);
            localStorage.setItem('brewery-data', JSON.stringify(data));
            appendBreweryData();
        })
        .catch(error => console.error('Error during fetch:', error));
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

document.getElementById('search-around-me-btn').addEventListener('click', function() {
    if (!map) {
        initMapAndFetchBreweries();
    } else {
        getUserLocation((lat, lng) => fetchBreweriesNearby(lat, lng));
    }
});


searchBtn.addEventListener('click', function(event) {
    event.preventDefault();
    handleFormSubmit(event);
});




$(document).ready(function() {
    if ($('#map').length > 0) {
        console.log('Map container is ready.');
        initMapAndFetchBreweries();
    } else {
        console.log('Map container is not found.');
    }
});
// document.addEventListener('DOMContentLoaded', function() {
//     getUserLocation();  // Automatically fetch and display the user's location on load
// });


