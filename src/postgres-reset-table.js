const pg = require('pg');
const config = require('./config');

const client = new pg.Client(config.config);

client.connect()
.then(() => {
    return client.query('DELETE FROM people')
    .then(res => {
        console.log('table reset');
        client.end();
    })
    .catch(err => {
        console.error(err);
        client.end();
    })
})
.catch(err => {
    if(err) console.error( 'error connecting to db: ', err);
});

