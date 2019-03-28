
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
            let row, prev_i = 0;
            for (let i = 0; i < movieData.length; i++) {
                let element = movieData[i]
                // row = document.createElement('div')
                let column = document.createElement('div')
                let card = document.createElement('div')
                let container = document.createElement('div')

                let imdbid = document.createElement('div')
                let title = document.createElement('div')
                let year = document.createElement('div')
                let type = document.createElement('div')
                let poster = document.createElement('img')
                let addButton = document.createElement('button')
                // row.className = 'row'
                column.className = 'column'
                card.className = 'card'
                container.className = 'container'

                imdbid.innerHTML = element.imdbid
                title.innerHTML = element.title
                year.innerHTML = element.year
                type.innerHTML = element.type
                poster.src = element.poster
                poster.style = 'width:100%'
                addButton.innerText = 'Add'
                addButton.onclick = function () { addMovieDB(element) }

                if (i - prev_i === 4 || i === 0) {
                    row = document.createElement('div')
                    row.className = 'row'
                    cards.appendChild(row)

                    prev_i = i
                }
                row.appendChild(column)
                cards.appendChild(row)
                row.appendChild(column)
                column.appendChild(card)
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