const express = require('express')
const knex = require('knex')
const path = require('path')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const morgan = require('morgan')
const imdb = require('imdb-api')
const fs = require('fs')


const PORT = 8080 // Server Port Variable

const db = knex({ // postgress database login info
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'nilay',
        password: 'password',
        database: 'the-movie-express'
    }
})

const getApiKey = () => {
    const api_file = fs.readFileSync('OMDB_API_KEY.txt')
    return api_file.toString()
}
const OMDB_API_KEY = getApiKey() // get api key from file
console.log('OMDB API KEY:', OMDB_API_KEY)

// CUSTOM FUNCTIONS Start ----------------------------------------

/*
    returns a list of chunks of an passed array,
    depending on the chunk size specified
*/
const chunkArray = (array, chunk_size) => {
    let i, j, array_chunks = [], chunk = chunk_size
    for (i = 0, j = array.length; i < j; i += chunk) {
        array_chunks.push(array.slice(i, i + chunk))
    }
    return array_chunks
}

// CUSTOM FUNCTIONS End -------------------------------------------

const app = express() // init express app

app.use(morgan('dev')) // a logger for express

// to parse the body of post requests -> bodyParser :
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.engine('hbs', exphbs({
    extname: 'hbs',
    defaultLayout: 'main',
    helpers: {
        escape: function (variable) {
            return variable.replace(/(['"])/g, '\\$1')
        }
    }
}))
app.set('view engine', 'hbs')

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.redirect('/home')
})

app.post('/', (req, res) => {
    res.send(req.body.key)
})

/* 
  /home : GET
  Home Page
*/
app.get('/home', (req, res) => {
    let page = parseInt(req.query.page)
    let sort = req.query.sort
    sort = (sort == '' || typeof sort === 'undefined') ? 'date' : sort
    page = (isNaN(page) || page === 0) ? 1 : page

    if (sort === 'name') {
        db('movies').select('*').orderBy('title', 'asc')
            .then((movies) => {
                movies_chunks = chunkArray(movies, 10)
                const pageExists = (page) => {
                    return (page <= movies_chunks.length && page > 0)
                }
                if (pageExists(page) || page === 1) {
                    res.render('home', {
                        pageTitle: 'The Movie Express',
                        content: 'Home',
                        layout: 'home-layout',
                        array: movies_chunks[page - 1],
                        currentPage: page,
                        previousPage: (pageExists(page - 1)) ? page - 1 : false,
                        nextPage: (pageExists(page + 1)) ? page + 1 : false,
                        sort
                    })
                }
                else {
                    res.status(404).send('Error page not found')
                }
            })
    }
    else if (sort === 'date') {
        db('movies').select('*').orderBy('updated', 'desc')
            .then((movies) => {
                movies_chunks = chunkArray(movies, 10)
                const pageExists = (page) => {
                    return (page <= movies_chunks.length && page > 0)
                }
                if (pageExists(page) || page === 1) {
                    res.render('home', {
                        pageTitle: 'The Movie Express',
                        content: 'Home',
                        layout: 'home-layout',
                        array: movies_chunks[page - 1],
                        currentPage: page,
                        previousPage: (pageExists(page - 1)) ? page - 1 : false,
                        nextPage: (pageExists(page + 1)) ? page + 1 : false,
                        sort
                    })
                }
                else {
                    res.status(404).send('Error page not found')
                }
            })
    }
    else if (sort === 'year') {
        db('movies').select('*').orderBy('year', 'desc')
            .then((movies) => {
                movies_chunks = chunkArray(movies, 10)
                const pageExists = (page) => {
                    return (page <= movies_chunks.length && page > 0)
                }
                if (pageExists(page) || page === 1) {
                    res.render('home', {
                        pageTitle: 'The Movie Express',
                        content: 'Home',
                        layout: 'home-layout',
                        array: movies_chunks[page - 1],
                        currentPage: page,
                        previousPage: (pageExists(page - 1)) ? page - 1 : false,
                        nextPage: (pageExists(page + 1)) ? page + 1 : false,
                        sort
                    })
                }
                else {
                    res.status(404).send('Error page not found')
                }

            })
    }

})

/* 
  /submit : GET
  Movie Submit by search and add page
*/
app.get('/submit', (req, res) => {
    res.render('submit', { pageTitle: 'The Movie Express', content: 'Submit', layout: 'submit-layout' })
})

/* 
  /submit : POST
  Enables searching for a movie and adding
  the desired movie to db.
*/
app.post('/submit', (req, res) => {
    let searchString = req.body.searchText
    imdb.search({
        name: searchString
    },
        {
            apiKey: OMDB_API_KEY
        })
        .then((searchResults) => {
            console.log('movie ID:', searchResults.results[0].imdbid)
            res.json(searchResults.results)
        })
        .catch(err => {
            console.error(err)
            res.status(400).json('failure')
        });
})

/* 
  /add-movie : POST
  Adds the movie to the database
*/
app.post('/add-movie', (req, res) => {
    const { imdbid, title, year, type, poster } = req.body
    console.log('ID', imdbid)
    let date = new Date()
    return db.table('movies').insert({
        id: imdbid,
        created: date,
        updated: date,
        title,
        year,
        type,
        poster
    })
        .then(() => {
            console.log('movie ID:', imdbid)
            res.json('success')
        })
        .catch(err => {
            console.error(err)
            res.status(400).json('failure')
        })
})

/* 
  /delete-movie : POST
  Removes the movie from the database
*/
app.post('/delete-movie', (req, res) => {
    const imdbid = req.body.imdbid
    console.log('ID:', imdbid)
    db.table('movies').where({ id: imdbid }).del()
        .then(() => {
            console.log('movie ID:', imdbid)
            res.json('success')
        })
        .catch(err => {
            console.error(err)
            res.status(400).json('failure')
        })
})

app.listen(PORT, () => {
    console.log('Serving on port:', PORT)
})