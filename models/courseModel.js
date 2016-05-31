var mongoose = require('mongoose');

var courseSchema = mongoose.Schema({
  city: String,
  description: String,
  name: String,
  directions: String,
  holes: Number,
  teeTypes: String,
  zipCode: Number,
  state: String,
  lat: Number,
  long: Number
})

module.exports = mongoose.model('Course', courseSchema);
