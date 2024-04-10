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

function handleFormSubmit(event) {
    event.preventDefault();
    //We need to get the data from the form and send it through the fetch function
    let parameter = selectField.value;
    const searchValue = searchBar.value;
    parameter = `${parameter}=${searchValue}`
    fetchBreweryData(parameter);
}

function fetchBreweryData(parameter) {
    //We need to take the data inputed from the form and use it to search for breweies through the API
    const baseAPIurl = 'https://api.openbrewerydb.org/v1/breweries';
    const fetchUrl = `${baseAPIurl}?${parameter}&per_page=15`
    
    async function fetchOpenBreweryDB() {
        try {
            const response = await fetch(fetchUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            localStorage.setItem('brewery-data', JSON.stringify(data)); 
            console.log(data);
        } catch (error) {
            console.error('Error fetching brewery data:', error);
        }
    }

    fetchOpenBreweryDB();
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



searchBtn.addEventListener('click', function(event){
    handleFormSubmit(event);
})

selectField.addEventListener('change', function(){
    const selectedOption = selectField.value;
        switch (selectedOption) {
            case 'by_name':
              searchBar.placeholder = 'Search by Name';
              break;
            case 'by_dist':
              searchBar.placeholder = 'Search by Distance';
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