// IMPORT LIBRARY
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const artistController = require('./controllers/Artist');
const albumController = require('./controllers/Album');
const songController = require('./controllers/Song');

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

// GET ROUTE - HTTP MESSAGE `localhost:3000`
app.get('/', (request, response) => response.send('Hello MongoDb!'));

// POST ROUTE - ADD ARTIST TO COLLECTION
app.post('/Artist', artistController.post);

// GET ROUTE - RETURN ARTIST COLLECTION
app.get('/Artist', artistController.list);

// GET ROUTE - RETURN SPECIFIC ARTIST FROM COLLECTION
app.get('/Artist/:artistId', artistController.get);

// PUT ROUTE - UPDATE AN ARTIST PROFILE
app.put('/Artist/:artistId', artistController.put);

// DELETE ROUTE - DELETE AN ARTIST PROFILE
app.delete('/Artist/:artistId', artistController.deleteArtist);

// POST ROUTE - ADD ALBUMS TO ARTIST COLLECTION
app.post('/Artist/:artistId/album', albumController.postAlbum);

// POST ROUTE - ADD SONGS TO ARTIST COLLECTION
app.post('/Album/:albumId/song', songController.postSong);

// FIRES UP WEB SERVER
app.listen(3000, () => console.log('Music API listening on port 3000'));
