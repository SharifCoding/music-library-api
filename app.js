// IMPORT LIBRARY
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const artist = require('./controllers/Artist');

// MLAB CONNECTION STRING
require('dotenv').config({
  path: path.join(__dirname, './settings.env'),
});

// INSTANTIATE APP
const app = express();

// CONNECTION TO MONGODB INSTANCE
mongoose.connect(process.env.DATABASE_CONN);

// BODY-PARSER MIDDLEWARE
app.use(bodyParser.json());

// GET ROUTE
app.get('/', (request, response) => response.send('Hello MongoDb!'));

// POST ROUTE
app.post('/Artist', artist.post);

// FIRES UP WEB SERVER
app.listen(3000, () => console.log('Music API listening on port 3000'));
