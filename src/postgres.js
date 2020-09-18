const pg = require('pg');
const config = require('./config');

var client = new pg.Client(config.config);

client.connect()
.then(() => {
  return client.query('CREATE TABLE IF NOT EXISTS people (Title text, First text, Last text, Date date, Age integer, Gender text)')
  .then(res => {
    console.log('table created', res);
    client.end();
  })
  .catch(err => {
    console.error( 'there was an error creating the table: ', err);
    client.end();
  })
})
.catch(err => {
  if(err) console.error("error connecting to db: ",err)
})


/**
 * You will need to setup a connection to the postgres database
 * that you just created in addition to that we will need one table
 * with the columns Id, Title, First, Last, Date, Age, Gender.
 *
 * We like to use the npm package "pg" for connecting to our database and
 * executing operations on it. Here is a link to the docs if you would like
 * to use the same library: https://node-postgres.com/.
 *
 * This should also be the place where you put all of your helper methods
 * for interacting with the database.
 *
 * If you create the table using the web interface for elephantsql then
 * please put the creation schema in a comment in this file. If you create
 * the table using a query defined in this file then you can skip this step.
 */
