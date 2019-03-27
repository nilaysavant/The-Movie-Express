const knex = require('knex')

const db = knex({ // postgress database login info
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'nilay',
        password: 'password',
        database: 'the-movie-express'
    }
});

// create a table for movies : movie-db
db.schema.hasTable('movies') // check if already created
    .then((exists) => {
        if (!exists) {
            return db.schema.createTable('movies', (table) => {
                table.increments('movie_id').unique().primary() // unique primary key ID field for each movie
                table.text('movie_name') // movie name field
            })
        }
    })
    .then(() => {
        db.select('*').from('movies')
            .then(data => {  // read all coloumns from movies table in the-movie-express(db)
                console.log(data) // and console log it 
            })
    })
    .catch(console.error) // log any errors
    .finally(() => {
        db.destroy() // close the database to quit the app
    })
