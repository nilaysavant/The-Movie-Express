const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')


const PORT = 8080
const app = express()

app.use(morgan('dev')) // a logger for express

// to parse the body of post requests -> bodyParser :
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())


app.get('/', (req, res) => {
    res.send('hello!')
})

app.post('/', (req, res) => {
    res.send(req.body.key)
})

app.listen(PORT, () => {
    console.log('Serving on port:', PORT)
})