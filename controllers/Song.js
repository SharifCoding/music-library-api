// IMPORT LIBRARY
const Artist = require('../models/Artist');
const Album = require('../models/Album');
const Song = require('../models/Song');

// POST HANDLER
exports.postSong = (request, response) => {
  // query the Album collection using the albumId from request parameter
  Album.findById(request.params.albumId, (albumNotFoundErr, album) => {
    if (albumNotFoundErr) {
      response.json('Error: album not found');
    }
    // query the Artist collection using the artistId from request body
    Artist.findById(request.body.artistId, (artistNotFoundErr, artist) => {
      if (artistNotFoundErr) {
        response.json('Error: artist not found');
      }
      // create a new Song with a name field set to the name from request body
      const mySong = new Song({
        name: request.body.name,
        artist,
        album,
      });
      // save new Song and send a JSON response with the created song
      mySong.save((createErr, createdSong) => {
        if (createErr) {
          response.json('Error: unable to save song');
        }
        response.json(createdSong);
      });
    });
  });
};
