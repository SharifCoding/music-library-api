/* eslint no-underscore-dangle: 0 no-console: 0 */
const mongoose = require('mongoose');
const path = require('path');
const httpMocks = require('node-mocks-http');
const events = require('events');
const { post } = require('../../controllers/Artist');
const Artist = require('../../models/Artist');

// MLAB connection string
require('dotenv').config({
  path: path.join(__dirname, '../../settings.env'),
});

describe('Artist POST Endpoint', () => {
  // establish a connection to our database before all test cases run
  beforeAll((done) => {
    mongoose.connect(process.env.TEST_DATABASE_CONN, done);
  });
  // test API against the test database
  it('should create a new Artist', (done) => {
    expect.assertions(2);
    // mock a request object
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/Artist',
      body: {
        name: 'Gold Panda',
        genre: 'Ambient',
      },
    });
    // mock a response object
    const response = httpMocks.createResponse({
      eventEmitter: events.EventEmitter,
    });
    // pass request/response objects into controller
    post(request, response);

    // listen out for end event that signals res.send
    response.on('end', () => {
      const artistPOST = JSON.parse(response._getData());
      expect(artistPOST.name).toBe('Gold Panda');
      expect(artistPOST.genre).toBe('Ambient');
      done();
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
