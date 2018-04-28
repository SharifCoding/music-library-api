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

// GET HANDLER
exports.getAlbums = (require, response) => {
  // `find` artist that matches artistId - `populate` artist fields - `exec` to run the query
  Album.find({ artist: require.params.artistId }).populate('artist').exec((error, albums) => {
    if (error) {
      response.json('Cant find album');
    }
    // send a JSON response with the returned albums
    response.json(albums);
  });
};
