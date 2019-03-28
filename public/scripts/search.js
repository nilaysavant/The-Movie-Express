
let searchbuttonElement = document.getElementById('searchButtton')
let textInputElement = document.getElementById('searchText')


let cards = document.getElementById('cards')

let movieData = []

function searchMovie() {
    postData(`/search`, { searchText: textInputElement.value })
        .then(data => {
            movieData = data
            console.log(data)
            cards.innerHTML = ''
            movieData.forEach(element => {
                let row = document.createElement('div')
                let column = document.createElement('div')
                let card = document.createElement('div')

                let imdbid = document.createElement('div')
                let title = document.createElement('div')
                let year = document.createElement('div')
                let type = document.createElement('div')
                let poster = document.createElement('img')
                let addButton = document.createElement('button')

                imdbid.innerHTML = element.imdbid
                title.innerHTML = element.title
                year.innerHTML = element.year
                type.innerHTML = element.type
                poster.src = element.poster
                addButton.innerText = 'Add'
                addButton.onclick = function () { addMovieDB(element) }

                cards.appendChild(row)
                row.appendChild(column)
                card.appendChild(poster)
                card.appendChild(document.createElement('br'))
                column.appendChild(card)
                card.appendChild(imdbid)
                card.appendChild(title)
                card.appendChild(year)
                card.appendChild(type)
                card.appendChild(addButton)
                card.appendChild(document.createElement('br'))
                card.appendChild(document.createElement('br'))
                card.appendChild(document.createElement('br'))
            });

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