'use strict';

var mongoose = require('mongoose');

var Class;

var classSchema = mongoose.Schema({
  teacher: {type: String}
});

Class = mongoose.model('Class', classSchema);

module.exports = Class;
