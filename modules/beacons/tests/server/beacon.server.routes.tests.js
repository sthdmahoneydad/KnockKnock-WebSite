'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Beacon = mongoose.model('Beacon'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  beacon;

/**
 * Beacon routes tests
 */
describe('Beacon CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Beacon
    user.save(function () {
      beacon = {
        name: 'Beacon name'
      };

      done();
    });
  });

  it('should be able to save a Beacon if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Beacon
        agent.post('/api/beacons')
          .send(beacon)
          .expect(200)
          .end(function (beaconSaveErr, beaconSaveRes) {
            // Handle Beacon save error
            if (beaconSaveErr) {
              return done(beaconSaveErr);
            }

            // Get a list of Beacons
            agent.get('/api/beacons')
              .end(function (beaconsGetErr, beaconsGetRes) {
                // Handle Beacons save error
                if (beaconsGetErr) {
                  return done(beaconsGetErr);
                }

                // Get Beacons list
                var beacons = beaconsGetRes.body;

                // Set assertions
                (beacons[0].user._id).should.equal(userId);
                (beacons[0].name).should.match('Beacon name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Beacon if not logged in', function (done) {
    agent.post('/api/beacons')
      .send(beacon)
      .expect(403)
      .end(function (beaconSaveErr, beaconSaveRes) {
        // Call the assertion callback
        done(beaconSaveErr);
      });
  });

  it('should not be able to save an Beacon if no name is provided', function (done) {
    // Invalidate name field
    beacon.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Beacon
        agent.post('/api/beacons')
          .send(beacon)
          .expect(400)
          .end(function (beaconSaveErr, beaconSaveRes) {
            // Set message assertion
            (beaconSaveRes.body.message).should.match('Please fill Beacon name');

            // Handle Beacon save error
            done(beaconSaveErr);
          });
      });
  });

  it('should be able to update an Beacon if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Beacon
        agent.post('/api/beacons')
          .send(beacon)
          .expect(200)
          .end(function (beaconSaveErr, beaconSaveRes) {
            // Handle Beacon save error
            if (beaconSaveErr) {
              return done(beaconSaveErr);
            }

            // Update Beacon name
            beacon.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Beacon
            agent.put('/api/beacons/' + beaconSaveRes.body._id)
              .send(beacon)
              .expect(200)
              .end(function (beaconUpdateErr, beaconUpdateRes) {
                // Handle Beacon update error
                if (beaconUpdateErr) {
                  return done(beaconUpdateErr);
                }

                // Set assertions
                (beaconUpdateRes.body._id).should.equal(beaconSaveRes.body._id);
                (beaconUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Beacons if not signed in', function (done) {
    // Create new Beacon model instance
    var beaconObj = new Beacon(beacon);

    // Save the beacon
    beaconObj.save(function () {
      // Request Beacons
      request(app).get('/api/beacons')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Beacon if not signed in', function (done) {
    // Create new Beacon model instance
    var beaconObj = new Beacon(beacon);

    // Save the Beacon
    beaconObj.save(function () {
      request(app).get('/api/beacons/' + beaconObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', beacon.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Beacon with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/beacons/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Beacon is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Beacon which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Beacon
    request(app).get('/api/beacons/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Beacon with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Beacon if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Beacon
        agent.post('/api/beacons')
          .send(beacon)
          .expect(200)
          .end(function (beaconSaveErr, beaconSaveRes) {
            // Handle Beacon save error
            if (beaconSaveErr) {
              return done(beaconSaveErr);
            }

            // Delete an existing Beacon
            agent.delete('/api/beacons/' + beaconSaveRes.body._id)
              .send(beacon)
              .expect(200)
              .end(function (beaconDeleteErr, beaconDeleteRes) {
                // Handle beacon error error
                if (beaconDeleteErr) {
                  return done(beaconDeleteErr);
                }

                // Set assertions
                (beaconDeleteRes.body._id).should.equal(beaconSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Beacon if not signed in', function (done) {
    // Set Beacon user
    beacon.user = user;

    // Create new Beacon model instance
    var beaconObj = new Beacon(beacon);

    // Save the Beacon
    beaconObj.save(function () {
      // Try deleting Beacon
      request(app).delete('/api/beacons/' + beaconObj._id)
        .expect(403)
        .end(function (beaconDeleteErr, beaconDeleteRes) {
          // Set message assertion
          (beaconDeleteRes.body.message).should.match('User is not authorized');

          // Handle Beacon error error
          done(beaconDeleteErr);
        });

    });
  });

  it('should be able to get a single Beacon that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Beacon
          agent.post('/api/beacons')
            .send(beacon)
            .expect(200)
            .end(function (beaconSaveErr, beaconSaveRes) {
              // Handle Beacon save error
              if (beaconSaveErr) {
                return done(beaconSaveErr);
              }

              // Set assertions on new Beacon
              (beaconSaveRes.body.name).should.equal(beacon.name);
              should.exist(beaconSaveRes.body.user);
              should.equal(beaconSaveRes.body.user._id, orphanId);

              // force the Beacon to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Beacon
                    agent.get('/api/beacons/' + beaconSaveRes.body._id)
                      .expect(200)
                      .end(function (beaconInfoErr, beaconInfoRes) {
                        // Handle Beacon error
                        if (beaconInfoErr) {
                          return done(beaconInfoErr);
                        }

                        // Set assertions
                        (beaconInfoRes.body._id).should.equal(beaconSaveRes.body._id);
                        (beaconInfoRes.body.name).should.equal(beacon.name);
                        should.equal(beaconInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Beacon.remove().exec(done);
    });
  });
});
