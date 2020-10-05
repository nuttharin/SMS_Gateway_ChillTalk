const MongoClient  = require('mongodb').MongoClient ;
const { Pool ,Client } = require("pg");

const URL_MONGODB_IOT = process.env.URL_MONGODB +process.env.DATABASE_DATA_IOT ;



// set config Postgres
const connectionStringPostgres = `postgresql://${process.env.DB_POSTGRES_USER}:${process.env.DB_POSTGRES_PASSWORD}@${process.env.DB_POSTGRES_HOST}:${process.env.DB_POSTGRES_PORT}/${process.env.DB_POSTGRES_DATABASE}`;

const pool = new Pool({
    connectionString:  connectionStringPostgres   
});
console.log(pool);

const client = new Client({
    host: process.env.DB_POSTGRES_HOST,
    port: process.env.DB_POSTGRES_PORT,
    user: process.env.DB_POSTGRES_USER,
    password: process.env.DB_POSTGRES_PASSWORD,
    database : process.env.DB_POSTGRES_DATABASE
});
console.log(client);

module.exports = {
    pool,
    MongoClient,
    URL_MONGODB_IOT
}
