// IMPORT LIBRARY
const Artist = require('../models/Artist');
const Album = require('../models/Album');

// POST HANDLER
exports.postAlbum = (request, response) => {
  Artist.findById(request.params.artistId, (error, artist) => {
    if (error) {
      response.json('Error: something went wrong');
    }
    const myAlbum = new Album({
      artist,
      name: request.body.name,
      year: request.body.year,
    });
    myAlbum.save((crateErr, createAlbum) => {
      if (crateErr) {
        response.json('Cant create album');
      }
      response.json(createAlbum);
    });
  });
};
