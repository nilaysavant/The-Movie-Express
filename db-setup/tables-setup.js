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

// Scheema/Structure
/*
    MOVIES (table)
    id  | title | year | type | poster
    ----|-------|------|------|-------

*/

// create a table for movies
db.schema.hasTable('movies') // check if already created
    .then((exists) => {
        if (!exists) {
            return db.schema.createTable('movies', (table) => {
                table.increments('id').unique().primary() // unique primary key ID field for each movie
                table.text('title') // movie name field
                table.string('year', 5) // movie name field
                table.string('type', 10) // movie name field
                table.text('poster') // movie name field

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
