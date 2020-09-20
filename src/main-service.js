require("dotenv/config");
/**
 * Your main service should implement CRUD operations on the postgres database
 * for the users table. There are some simple route definitions listed as examples
 * to help you get started. Feel free to deviate from the examples if you wish.
 *
 * Make sure to handle any errors that could arise as well!
 */
const express = require('express');
const bodyParser = require('body-parser');
const { getFullNames, getAllUsers, addUser } = require('./postgres');
const router = express.Router();
router.use(bodyParser.json());

router.use((req, res, next) => {
    next();
});
/**
 * method: GET
 * route: /migrate-users
 * purpose: Use the function(s) written in ../populate-postgres as a job that is
 * run whenever this route is hit.
*/

/**
 * method: GET
 * route: /users
 * purpose: Return an array of users
 * bonus: Support pagination
 */
router.post('/users', (req, res) => {
    let page = req.body.page;
    if(page && typeof page === 'number') {
        getAllUsers(page, results => {
            res.send(results.rows);
        })
    } else {
        res.send('Page selection invalid');
    }
});
/**
 * method: GET
 * route: /fullnames
 * purpose: Return an array of the first and last name for each user
 */
router.get('/fullnames', (req, res) => {
    const names = [];
    getFullNames(results => {
        if(results.rows.length) {
            results.rows.forEach(person => {
                let fullName = `${person.first} ${person.last}`;
                names.push(fullName);
            })
            res.send(names);   
        } else {
            res.send('There were no names to retrieve');
        } 
    })
});
/**
 * method: POST
 * route: /users
 * purpose: Add a new user to the database
 */
router.post('/adduser', (req, res) => {
    addUser(req.body.values, results => {
        if(results.rowCount) {
            res.send('User added');
        } else {
            res.send("There was an error adding this user");
        }
    })
})
/**
 * method: PATCH
 * route: /users
 * purpose: Update a user record
 */

/**
 * method: DELETE
 * route: /users
 * purpose: Remove a given user
 */

 module.exports = router;