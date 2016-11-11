'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Beacon = mongoose.model('Beacon'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Beacon
 */
exports.create = function(req, res) {
  var beacon = new Beacon(req.body);
  beacon.user = req.user;

  beacon.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(beacon);
    }
  });
};

/**
 * Show the current Beacon
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var beacon = req.beacon ? req.beacon.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  beacon.isCurrentUserOwner = req.user && beacon.user && beacon.user._id.toString() === req.user._id.toString();

  res.jsonp(beacon);
};

/**
 * Update a Beacon
 */
exports.update = function(req, res) {
  var beacon = req.beacon;

  beacon = _.extend(beacon, req.body);

  beacon.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(beacon);
    }
  });
};

/**
 * Delete an Beacon
 */
exports.delete = function(req, res) {
  var beacon = req.beacon;

  beacon.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(beacon);
    }
  });
};

/**
 * List of Beacons
 */
exports.list = function(req, res) {
  Beacon.find().sort('-created').populate('user', 'displayName').exec(function(err, beacons) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(beacons);
    }
  });
};

/**
 * Beacon middleware
 */
exports.beaconByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Beacon is invalid'
    });
  }

  Beacon.findById(id).populate('user', 'displayName').exec(function (err, beacon) {
    if (err) {
      return next(err);
    } else if (!beacon) {
      return res.status(404).send({
        message: 'No Beacon with that identifier has been found'
      });
    }
    req.beacon = beacon;
    next();
  });
};
