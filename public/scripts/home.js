
function archiveMovie(movieID, movieTitle) {
    let verify_delete = confirm('Are you sure you want to archive ' + movieTitle + ' ?')
    if (verify_delete) {
        console.log('deleting movie with ID:', movieID)
        postData('/delete-movie', { imdbid: movieID })
        alert('movie '+ movieTitle + ' deleted !')
        location.reload(true)
    }
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