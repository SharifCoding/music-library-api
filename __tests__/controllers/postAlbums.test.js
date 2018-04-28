/* eslint no-underscore-dangle: 0 no-console: 0 */
const mongoose = require('mongoose');
const path = require('path');
const httpMocks = require('node-mocks-http');
const events = require('events');
const { postAlbum } = require('../../controllers/Artist');
const Artist = require('../../models/Artist');
const Album = require('../../models/Album');

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
      expect.assertions(3);
      // mock a request object
      const request = httpMocks.createRequest({
        method: 'POST',
        url: `/Artist/${artistCreated._id}/album`,
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

      // listen out for end event that signals response.send
      response.on('end', () => {
        const albumCreated = JSON.parse(response._getData());
        expect(albumCreated.name).toEqual('Thriller');
        expect(albumCreated.year).toEqual(1982);
        expect(albumCreated.artist._id).toEqual(artistCreated._id.toString());
        done();
      });
    });
  });
  // delete all documents 'drop(delete)'
  afterEach((done) => {
    Artist.collection.drop((artistDrop) => {
      Album.collection.drop((albumDrop) => {
        if (artistDrop || albumDrop) {
          console.log('cant drop collections');
        }
        done();
      });
    });
  });
  // close connection
  afterAll(() => {
    mongoose.connection.close();
  });
});
