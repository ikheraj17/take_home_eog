const pg = require('pg');
const config = require('./config');

var client = new pg.Client(config.config);

client.connect()
.then(() => {
  return client.query('CREATE TABLE IF NOT EXISTS people (id serial PRIMARY KEY, Title text, First text, Last text, Date date, Age integer, Gender text)')
  .then(res => {
    console.log('people table discovered or created in db instance');
  })
  .catch(err => {
    console.error( 'there was an error creating the table: ', err);
    client.end();
  })
})
.catch(err => {
  console.error("error connecting to db: ",err)
});

const getAllUsers = (page,callback) => {
  if(page === 1) {
    let query = `SELECT * FROM people where id BETWEEN ${page} AND ${page + 9}`;
    client.query(query)
      .then(res => {
        callback(res);
      })
      .catch(err => {
        callback('Could not retrieve users');
      });
  } else {
    let offset = page * 10 - 10;
    query = `SELECT * FROM people where id BETWEEN ${offset + 1} AND ${offset + 10}`;
    client.query(query)
      .then(res => {
        callback(res);
      })
      .catch(err => {
        callback('could not retrieve users: ', err);
      });
  }
};

const getFullNames = callback => {

  const query = `SELECT First, Last FROM people`;
  client.query(query)
    .then(res => {
      callback(res);
    })
    .catch(err => {
       callback("could not fetch full names: ",err);
    });
};

const addUser = (user, callback) => {
  const query = "INSERT INTO people (Title, First, Last, Date, Age, Gender) VALUES ($1, $2, $3, $4, $5, $6)";
  client.query(query, user)
    .then(res => {
      callback(res);
    })
    .catch(err => {
      callback(err);
    });
};

const deleteUser = (id, callback) => {
  const query = `DELETE FROM people WHERE id=${id}`;
  client.query(query)
    .then(res => {
      callback(res);
    }).catch(err => {
      callback(err);
    });
}

const updateUser = (id, updated, callback) => {
  updated.forEach(field => {
    const query = `UPDATE people SET ${field[0]} = '${field[1]}' where id = ${id}`;
    client.query(query)
      .then(res => {
        callback(res);
      })
      .catch(err => {
        callback(err);
      });
  })
}

const selectUser = (id, first, callback) => {
  const query = `SELECT * FROM people WHERE id = ${id} AND First = '${first}'`;
  client.query(query)
  .then(res => {
    callback(res.rows);
  })
  .catch(err => {
    callback(err);
  })
}

module.exports = {getFullNames, getAllUsers, addUser, deleteUser, updateUser, selectUser};

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
