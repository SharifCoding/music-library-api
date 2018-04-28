/* eslint no-underscore-dangle: 0 no-console: 0 */
const mongoose = require('mongoose');
const path = require('path');
const httpMocks = require('node-mocks-http');
const events = require('events');
const { getAlbums } = require('../../controllers/Album');
const Artist = require('../../models/Artist');
const Album = require('../../models/Album');

// MLAB connection string
require('dotenv').config({
  path: path.join(__dirname, '../../settings.env'),
});

describe('Artist album GET Endpoint', () => {
  // establish a connection to our database before all test cases run
  beforeAll((done) => {
    mongoose.connect(process.env.TEST_DATABASE_CONN, done);
  });
  // test API against the test database
  it('should get an album from existing artist', (done) => {
    // create a new Artist
    const artist = new Artist({ name: 'Michael Jackson', genre: 'pop' });
    artist.save((err, artistCreated) => {
      if (err) {
        console.log(err, 'Error: something went wrong');
      }
      // create mutiple Albums
      const albums = [
        { name: 'Thriller', year: 1982, artist },
        { name: 'Bad', year: 1987, artist },
      ];
      // use Model.insertMany to save them to the Album collection
      Album.insertMany(albums, (albumsError, albumsCreated) => {
        if (albumsError) {
          console.log(err, 'Error: something went wrong');
        }
        // mock a request object
        const request = httpMocks.createRequest({
          method: 'GET',
          url: `/Artist/${artistCreated._id}/albums`,
          params: {
            artistId: artistCreated._id.toString(),
          },
        });
        // mock a response object
        const response = httpMocks.createResponse({
          eventEmitter: events.EventEmitter,
        });
        // pass request/response objects into controller
        getAlbums(request, response);

        // listen out for end event that signals response.send
        response.on('end', () => {
          const albumsFound = response._getData();
          // `JSON.stringify()` return results from `Album.insertMany` callback
          expect(albumsFound).toEqual(JSON.stringify(albumsCreated));
          done();
        });
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
