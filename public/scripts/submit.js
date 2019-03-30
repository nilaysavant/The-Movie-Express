
let searchbuttonElement = document.getElementById('searchButtton')
let textInputElement = document.getElementById('searchText')

// search on enter press in search input
textInputElement.addEventListener("keyup", function (event) {
    if (event.keyCode == 13 || event.which == 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        searchbuttonElement.click()
    }
})

let cards = document.getElementById('cards-id')

let movieData = []

searchbuttonElement.onclick = function () {
    let movie = textInputElement.value
    if (movie !== 'undefined' && movie !== '') {
        searchMovie(textInputElement.value)
    }
    else {
        console.error('enter a valid movie name!');
    }
}

function searchMovie(movieName) {
    postData('/submit', { searchText: movieName })
        .then(data => {
            if (data !== 'failure') {
                movieData = data
                console.log(data)
                cards.innerHTML = ''
                let row, prev_i = 0;
                for (let i = 0; i < movieData.length; i++) {
                    let element = movieData[i]
                    // row = document.createElement('div')
                    let column = document.createElement('div')
                    let card = document.createElement('article')
                    let container = document.createElement('div')

                    let imdbid = document.createElement('div')
                    let title = document.createElement('div')
                    let year = document.createElement('div')
                    let type = document.createElement('div')
                    let poster = document.createElement('img')
                    let addButton = document.createElement('button')
                    // row.className = 'row'
                    title.className = 'card-heading'
                    column.className = 'column'
                    card.className = 'card'
                    container.className = 'container'
                    imdbid.className = 'card-info'
                    year.className = 'card-info'
                    type.className = 'card-info'

                    // imdbid.innerHTML = element.imdbid
                    title.innerHTML = element.title
                    year.innerHTML = element.year
                    type.innerHTML = element.type
                    poster.src = element.poster
                    poster.style = 'width:100%'
                    addButton.innerText = 'Add'
                    addButton.className = 'button'
                    addButton.onclick = function () { addMovieDB(element) }

                    cards.appendChild(card)
                    card.appendChild(poster)
                    card.appendChild(container)
                    container.appendChild(document.createElement('br'))
                    container.appendChild(imdbid)
                    container.appendChild(title)
                    container.appendChild(year)
                    container.appendChild(type)
                    container.appendChild(addButton)
                    container.appendChild(document.createElement('br'))
                    container.appendChild(document.createElement('br'))
                    container.appendChild(document.createElement('br'))
                }
            }
            else {
                alert('Movie not found !')
            }

        }) // JSON-string from `response.json()` call
        .catch(error => console.error(error))
}

function addMovieDB(movie) {
    postData(`/add-movie`, movie)
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