/* eslint prefer-destructuring: 0 */
// IMPORT LIBRARY
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// ALBUM SCHEMA - STORE ALBUM INFORMATION LINKING TO ARTIST
const albumSchema = new Schema({
  name: String,
  year: Number,
  artist: {
    // reference to Artist collection
    type: Schema.Types.ObjectId, ref: 'Artist',
  },
});

// VARIABLES EXPORTED
module.exports = mongoose.model('Album', albumSchema);
