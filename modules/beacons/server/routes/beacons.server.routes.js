'use strict';

/**
 * Module dependencies
 */
var beaconsPolicy = require('../policies/beacons.server.policy'),
  beacons = require('../controllers/beacons.server.controller');

module.exports = function(app) {
  // Beacons Routes
  app.route('/api/beacons').all(beaconsPolicy.isAllowed)
    .get(beacons.list)
    .post(beacons.create);

  app.route('/api/beacons/:beaconId').all(beaconsPolicy.isAllowed)
    .get(beacons.read)
    .put(beacons.update)
    .delete(beacons.delete);

  // Finish by binding the Beacon middleware
  app.param('beaconId', beacons.beaconByID);
};
