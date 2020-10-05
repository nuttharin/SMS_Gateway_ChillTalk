const MongoClient  = require('mongodb').MongoClient ;
const { Pool ,Client } = require("pg");

const URL_MONGODB_IOT = process.env.URL_MONGODB +process.env.DATABASE_DATA_IOT ;



// set config Postgres
const connectionStringPostgres = `postgresql://${process.env.DB_POSTGRES_USER}:${process.env.DB_POSTGRES_PASSWORD}@${process.env.DB_POSTGRES_HOST}:${process.env.DB_POSTGRES_PORT}/${process.env.DB_POSTGRES_DATABASE}`;

const pool = new Pool({
    connectionString:  connectionStringPostgres   
});
console.log(pool);
pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    client.query('SELECT NOW()', (err, result) => {
      release()
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      console.log(result.rows)
    })
  })
const client = new Client({
    host: process.env.DB_POSTGRES_HOST,
    port: process.env.DB_POSTGRES_PORT,
    user: process.env.DB_POSTGRES_USER,
    password: process.env.DB_POSTGRES_PASSWORD,
    database : process.env.DB_POSTGRES_DATABASE
});
console.log(client);
client
  .connect()
  .then(() => console.log('connected'))
  .catch(err => console.error('connection error', err.stack))
module.exports = {
    pool,
    client,
    MongoClient,
    URL_MONGODB_IOT
}
