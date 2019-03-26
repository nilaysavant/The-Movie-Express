
searchbuttonElement = document.getElementById('searchButtton')
textInputElement = document.getElementById('searchText')


function searchMovie() {
    postData(`/search`, { searchText: textInputElement.value })
        .then(data => {
            console.log(data)
            document.getElementById('movieTitle').innerHTML = 'Title: ' + data.title
            document.getElementById('movieYear').innerHTML = 'Year: ' + data.year
            document.getElementById('moviePoster').src = data.poster

        }) // JSON-string from `response.json()` call
        .catch(error => console.error(error));
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