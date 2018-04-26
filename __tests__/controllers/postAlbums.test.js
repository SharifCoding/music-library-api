/* eslint no-underscore-dangle: 0 no-console: 0 */
const mongoose = require('mongoose');
const path = require('path');
const httpMocks = require('node-mocks-http');
const events = require('events');
const { postAlbum } = require('../../controllers/Artist');
const Artist = require('../../models/Artist');

// MLAB connection string
require('dotenv').config({
  path: path.join(__dirname, '../../settings.env'),
});

describe('Artist album POST Endpoint', () => {
  // establish a connection to our database before all test cases run
  beforeAll((done) => {
    mongoose.connect(process.env.TEST_DATABASE_CONN, done);
  });
  // test API against the test database
  it('should create/add an album to an existing artist', (done) => {
    const artist = new Artist({ name: 'Michael Jackson', genre: 'pop' });
    artist.save((err, artistCreated) => {
      if (err) {
        console.log(err, 'Error: something went wrong');
      }
      expect.assertions(1);
      // mock a request object
      const request = httpMocks.createRequest({
        method: 'POST',
        url: `/Artist/${artistCreated._id}/albums`,
        params: {
          artistId: artistCreated._id,
        },
        body: {
          name: 'Thriller',
          year: 1982,
        },
      });
      // mock a response object
      const response = httpMocks.createResponse({
        eventEmitter: events.EventEmitter,
      });
      // pass request/response objects into controller
      postAlbum(request, response);

      // listen out for end event that signals res.send
      response.on('end', () => {
        // `findById` to find artist and check albums has been added
        Artist.findById(artistCreated._id, (error, foundArtist) => {
          console.log(foundArtist);
          expect(foundArtist.albums.length).toEqual(1);
        });
        done();
      });
    });
  });
  // delete all documents 'drop(delete)'
  afterEach((done) => {
    Artist.collection.drop((e) => {
      if (e) {
        console.log(e);
      }
      done();
    });
    // close connection
    afterAll(() => {
      mongoose.connection.close();
    });
  });
});
