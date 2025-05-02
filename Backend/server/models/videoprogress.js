const mongoose = require('mongoose');

const intervalSchema = new mongoose.Schema({
  start: Number,
  end: Number
});

const videoProgressSchema = new mongoose.Schema({
  userId: String,
  videoId: String,
  watchedIntervals: [intervalSchema]
});

module.exports = mongoose.model('VideoProgress', videoProgressSchema);
