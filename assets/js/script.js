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
    //We need to get the user's current location so we know how far away breweries are from the user 
}

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
})