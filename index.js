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
});


const getApiKey = () => {
    const api_file = fs.readFileSync('OMDB_API_KEY.txt')
    return api_file.toString()
}
const OMDB_API_KEY = getApiKey() // get api key from file
console.log('OMDB API KEY:', OMDB_API_KEY)

const app = express() // init express app

app.use(morgan('dev')) // a logger for express

// to parse the body of post requests -> bodyParser :
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'main' }));
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.send('hello!')
})

app.post('/', (req, res) => {
    res.send(req.body.key)
})

app.get('/home', (req, res) => {
    res.render('home', { pageTitle: 'The Movie Express', content: 'Home' })
})

/* 
  /search : POST
  Enables searching for a movie and currently auto adds 
  the first result to db.
*/
app.post('/search', (req, res) => {
    let searchString = req.body.searchText
    imdb.search({
        name: searchString
    },
        {
            apiKey: OMDB_API_KEY
        })
        .then((searchResults) => {
            const { imdbid, title, year, type, poster } = searchResults.results[0]
            console.log('ID', searchResults.results[0])
            return db.table('movies').insert({
                id: imdbid,
                title,
                year,
                type,
                poster
            })
            .then(() => {
                console.log('movie ID:', imdbid)
                res.send(searchResults.results[0])
            })
        })
        .catch(err => {
            console.error(err)
            res.send('error !')
        });
})

app.listen(PORT, () => {
    console.log('Serving on port:', PORT)
})