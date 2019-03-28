
let searchbuttonElement = document.getElementById('searchButtton')
let textInputElement = document.getElementById('searchText')

let imdbid = document.getElementById('movieID')
let title = document.getElementById('movieTitle')
let year = document.getElementById('movieYear')
let type = document.getElementById('movieType')
let poster = document.getElementById('moviePoster')

let addButtonDiv = document.getElementById('addButtonDiv')
let addButton = document.createElement('button')
addButton.innerText = 'Add'
addButton.id = 'addButtonID'

addButton.onclick = addMovieDB

let movieData = {}

function searchMovie() {
    postData(`/search`, { searchText: textInputElement.value })
        .then(data => {
            movieData = data
            console.log(data)
            imdbid.innerHTML = 'ID: ' + movieData.imdbid
            title.innerHTML = 'Title: ' + movieData.title
            year.innerHTML = 'Year: ' + movieData.year
            type.innerHTML = 'Type: ' + movieData.type
            poster.src = movieData.poster

            if (addButtonDiv.hasChildNodes === true) {
                addButtonDiv.replaceChild(addButton)
            }
            else {
                addButtonDiv.appendChild(addButton)
            }
        }) // JSON-string from `response.json()` call
        .catch(error => console.error(error))
}

function addMovieDB() {
    postData(`/add-movie`, movieData)
        .then(data => {
            console.log(data)
            if (data === 'success') {
                alert('Movie Added Succesfully!')
            }
            else {
                alert('Movie already present in database!')
            }
        }) // JSON-string from `response.json()` call
        .catch(error => console.error(error))
}

function postData(url = ``, data = {}) {
    // Default options are marked with *
    return fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
            // "Content-Type": "application/x-www-form-urlencoded",
        },
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
        .then(response => response.json()); // parses JSON response into native Javascript objects 
}