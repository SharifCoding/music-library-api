/* eslint no-underscore-dangle: 0 no-console: 0 */
const mongoose = require('mongoose');
const path = require('path');
const httpMocks = require('node-mocks-http');
const events = require('events');
const { deleteArtist } = require('../../controllers/Artist');
const Artist = require('../../models/Artist');

// MLAB connection string
require('dotenv').config({
  path: path.join(__dirname, '../../settings.env'),
});

describe('Artist DELETE endpoint', () => {
  // establish a connection to our database before all test cases run
  beforeAll((done) => {
    mongoose.connect(process.env.TEST_DATABASE_CONN, done);
  });
  // test API against the test database
  it('should delete an artist from database', (done) => {
    expect.assertions(1);
    // create a new Artist with request body values
    const artist = new Artist({ name: 'Michael Jackson', genre: 'pop' });
    artist.save((err, artistCreated) => {
      // throw an error if there is one
      if (err) {
        console.log(err, 'Error: something went wrong');
      }
      // mock a request object
      const request = httpMocks.createRequest({
        method: 'DELETE',
        URL: '/Artist/123',
        params: {
          artistId: artistCreated._id,
        },
      });
      // mock a response object
      const response = httpMocks.createResponse({
        eventEmitter: events.EventEmitter,
      });
      // pass request/response objects into controller
      deleteArtist(request, response);

      // listen out for end event that signals response.send
      response.on('end', () => {
        Artist.findById(artistCreated._id, (error, artistsDELETE) => {
          expect(artistsDELETE).toEqual(null);
          done();
        });
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
  });
  // close connection
  afterAll(() => {
    mongoose.connection.close();
  });
});
