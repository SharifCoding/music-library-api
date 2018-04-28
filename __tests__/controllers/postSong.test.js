/* eslint no-underscore-dangle: 0 no-console: 0 */
const mongoose = require('mongoose');
const path = require('path');
const httpMocks = require('node-mocks-http');
const events = require('events');
const { postSong } = require('../../controllers/Song');
const Artist = require('../../models/Artist');
const Album = require('../../models/Album');
const Song = require('../../models/Song');

// MLAB connection string
require('dotenv').config({
  path: path.join(__dirname, '../../settings.env'),
});

describe('Artist song POST Endpoint', () => {
  // establish a connection to our database before all test cases run
  beforeAll((done) => {
    mongoose.connect(process.env.TEST_DATABASE_CONN, done);
  });
  // test API against the test database
  it('should add a song to an existing album', (done) => {
    // create a new Artist
    const artist = new Artist({ name: 'Michael Jackson', genre: 'pop' });
    artist.save((artistErr, artistCreated) => {
      if (artistErr) {
        console.log(artistErr, 'Error: something went wrong');
      }
      // create a new Album
      const album = new Album({ name: 'Thriller', year: '1982', artist: artistCreated });
      album.save((albumErr, albumCreated) => {
        if (albumErr) {
          console.log(albumErr, 'Error: something went wrong');
        }
        expect.assertions(3);
        // mock a request object
        const request = httpMocks.createRequest({
          method: 'POST',
          url: `/Album/${albumCreated._id}/song`,
          params: {
            albumId: albumCreated._id,
          },
          body: {
            name: 'Billy Jean',
            artistId: artistCreated._id,
          },
        });
        // mock a response object
        const response = httpMocks.createResponse({
          eventEmitter: events.EventEmitter,
        });
        // pass request/response objects into controller
        postSong(request, response);

        // listen out for end event that signals response.send
        response.on('end', () => {
          const songCreated = JSON.parse(response._getData());
          expect(songCreated.name).toEqual('Billy Jean');
          expect(songCreated.artist._id).toEqual(artistCreated._id.toString());
          expect(songCreated.album._id).toEqual(albumCreated._id.toString());
          done();
        });
      });
    });
  });
  // delete all documents 'drop(delete)'
  afterEach((done) => {
    Artist.collection.drop((artistDrop) => {
      Album.collection.drop((albumDrop) => {
        Song.collection.drop((songDrop) => {
          if (artistDrop || albumDrop || songDrop) {
            console.log('cant drop collections');
          }
          done();
        });
      });
    });
  });
  // close connection
  afterAll(() => {
    mongoose.connection.close();
  });
});
