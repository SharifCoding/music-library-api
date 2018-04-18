// IMPORT LIBRARY
const Artist = require('../models/Artist');

// POST HANDLER
exports.post = (request, response) => {
  const artist = new Artist({ name: request.body.name, genre: request.body.genre });
  artist.save((error, artistCreated) => {
    response.json(artistCreated);
  });
};

// LIST HANDLER
exports.list = (request, response) => {
  // `Artist.find({}, ...)` return all documents within the Artist collection
  Artist.find({}, (error, artists) => {
    if (error) {
      response.json('Error: something went wrong');
    }
    response.json(artists);
  });
};

// GET HANDLER
exports.get = (request, response) => {
  // function `Artist.findById(req.params.artistId` will return document with matching `_id` value
  Artist.findById(request.params.artistId, (error, artist) => {
    if (error) {
      response.json('Error: something went wrong');
    }
    response.json(artist);
  });
};
