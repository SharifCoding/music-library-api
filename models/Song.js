/* eslint prefer-destructuring: 0 */
// IMPORT LIBRARY
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// ALBUM SCHEMA - STORE ALBUM INFORMATION LINKING TO ARTIST
const songSchema = new Schema({
  name: String,
  // reference to Artist/Album collections
  artist: {
    type: Schema.Types.ObjectId, ref: 'Artist',
  },
  album: {
    type: Schema.Types.ObjectId, ref: 'Album',
  },
});

// VARIABLES EXPORTED
module.exports = mongoose.model('Song', songSchema);
