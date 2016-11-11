'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Beacon Schema
 */
var BeaconSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Beacon name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Beacon', BeaconSchema);
