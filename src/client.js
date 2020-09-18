require("dotenv/config");
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const port =  process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';
const app = express();
const api = require('./main-service');
app.use(cors());

app.use('/api', api);

app.listen(port, host, async err => {
    if(err) return console.error("there was an error connecting to the server: ", err);
    console.log(`App listening on host "${host}" and port ${port}`);
});
/**
 * Example Client Service
 *
 * This service should be considered a consumer of the main service.
 * We need to be able to integrate with many other teams and so need to ensure
 * our service can be used as seamlessly as possible by others.
 *
 * Here you should implement APIs that consume the APIs already created in our
 * main service. This can be either an express server or another Node.js
 * framework if you have experience with others.
 */

