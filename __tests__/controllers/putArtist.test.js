/* eslint no-underscore-dangle: 0 no-console: 0 */
const mongoose = require('mongoose');
const path = require('path');
const httpMocks = require('node-mocks-http');
const events = require('events');
const { put } = require('../../controllers/Artist');
const Artist = require('../../models/Artist');

// MLAB connection string
require('dotenv').config({
  path: path.join(__dirname, '../../settings.env'),
});

describe('Artist PUT endpoint', () => {
  // establish a connection to our database before all test cases run
  beforeAll((done) => {
    mongoose.connect(process.env.TEST_DATABASE_CONN, done);
  });
  // test API against the test database
  it('should update an artist from database', (done) => {
    expect.assertions(1);
    // create a new Artist with request body values
    const artist = new Artist({ name: 'Gold Panda', genre: 'Ambient' });
    artist.save((err, artistCreated) => {
      // throw an error if there is one
      if (err) {
        console.log(err, 'Error: something went wrong');
      }
      // mock a request object
      const request = httpMocks.createRequest({
        method: 'PUT',
        URL: '/Artist/123',
        params: {
          artistId: artistCreated._id,
        },
        body: {
          name: 'Gold Panda',
          genre: 'Electronica',
        },
      });
      // mock a response object
      const response = httpMocks.createResponse({
        eventEmitter: events.EventEmitter,
      });
      // pass request/response objects into controller
      put(request, response);

      // listen out for end event that signals res.send
      response.on('end', () => {
        const artistsPUT = JSON.parse(response._getData());
        expect(artistsPUT).toEqual({
          __v: 0,
          _id: artistCreated._id.toString(),
          name: 'Gold Panda',
          genre: 'Electronica',
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
  });
  // close connection
  afterAll(() => {
    mongoose.connection.close();
  });
});
