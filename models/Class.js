'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Class;

var classSchema = mongoose.Schema({
  snapshots: [{Schema.Types.ObjectId, ref: 'Snap'}]
});

Class = mongoose.model('Class', classSchema);

module.exports = Class;
