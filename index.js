const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const morgan = require('morgan')
const imdb = require('imdb-api')
const fs = require('fs')


const PORT = 8080 // Server Port Variable

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

app.get('/', (req, res) => {
    res.send('hello!')
})

app.post('/', (req, res) => {
    res.send(req.body.key)
})

app.get('/home', (req, res) => {
    res.render('home', { pageTitle: 'Some page title', content: 'some stuff' })
})

app.get('/search', (req, res) => {
    imdb.search({
        name: 'Toxic Avenger'
    },
        {
            apiKey: OMDB_API_KEY
        })
        .then((searchResults) => {
            console.log('RES:', searchResults.results[0].name)
            res.send('search success!')
        })
        .catch(err => {
            console.error(err)
            res.send('error !')
        });
})

app.listen(PORT, () => {
    console.log('Serving on port:', PORT)
})