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
  uuid: {
    type: String,
    default: '',
    required: 'Please fill Beacon UUID',
    trim: true
  },
  major: {
    type: Number,
    default: '',
    required: 'Please fill Beacon major',
    trim: true,
    min: 0,
    max: 65535
  },
  minor: {
    type: Number,
    default: '',
    required: 'Please fill Beacon minor',
    trim: true,
    min: 0,
    max: 65535
  },
  signaldistance: {
    type: Number,
    default: '',
    required: 'Please fill Beacon signal distance(# between 55-59) ',
    trim: true,
    min: 55,
    max: 59

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
