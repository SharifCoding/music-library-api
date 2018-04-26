// IMPORT LIBRARY
const Artist = require('../models/Artist');

// POST HANDLER
exports.post = (request, response) => {
  const artist = new Artist({ name: request.body.name, genre: request.body.genre });
  // `save()` inserts a new document
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
  // `Artist.findById(req.params.artistId` will return document with matching `_id` value
  Artist.findById(request.params.artistId, (error, artist) => {
    if (error) {
      response.json('Error: something went wrong');
    }
    response.json(artist);
  });
};

// PUT HANDLER
exports.put = (request, response) => {
  // 1. find the artist by id
  Artist.findById(request.params.artistId, (error, artist) => {
    if (error) {
      response.json('Error: something went wrong');
    }
    // 2. set the model parameters
    artist.set({ name: request.body.name });
    artist.set({ genre: request.body.genre });
    // 3. save it and then return the updated record
    artist.save((updateErr, artistUpdated) => {
      if (updateErr) {
        response.json('Could not update');
      }
      response.json(artistUpdated);
    });
  });
};

// DELETE HANDLER
exports.deleteArtist = (request, response) => {
  // `Artist.findByIdAndRemove(id, ...)` finds a matching document and removes it
  Artist.findByIdAndRemove(request.params.artistId, (error) => {
    if (error) {
      response.json('Error: something went wrong');
    }
    response.json('Deleted');
  });
};

// POST HANDLER - ALBUM
exports.postAlbum = (request, response) => {
  Artist.findById(request.params.artistId, (error, artist) => {
    if (error) {
      response.json('Error: something went wrong');
    }
    // `artist.albums.concat` concatenate previous value of the albums array with request body
    artist.set({ albums: artist.albums.concat([request.body]) });

    artist.save((updateErr, artistUpdated) => {
      if (updateErr) {
        response.json('Cant update');
      }

      response.json(artistUpdated);
    });
  });
};
