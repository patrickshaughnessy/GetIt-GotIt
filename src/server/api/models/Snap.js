'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Snap;

var snapSchema = mongoose.Schema({
  time: {type: Date},
  students: [{
    avatar: String,
    helpee: Boolean,
    helper: {
      chatID: String,
      helping: String
    },
    id: String,
    name: String,
    points: Number,
    teacher: Boolean
  }],
  percentage: Number,
  chatrooms: [{
    helpee: String,
    helper: String,
    messages: [{
      sender: String,
      text: String
    }]
  }]
});

Snap = mongoose.model('Snap', snapSchema);

module.exports = Snap;
