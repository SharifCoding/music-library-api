// IMPORT LIBRARY
const Artist = require('../models/Artist');

// POST HANDLER
exports.post = (request, response) => {
  const artist = new Artist({ name: request.body.name, genre: request.body.genre });
  artist.save((error, artistCreated) => {
    response.json(artistCreated);
  });
};
