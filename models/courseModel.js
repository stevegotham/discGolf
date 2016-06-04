// -=-=-=-=-=-=- variables and requires -=-=-=-=-=-=-=-=-
var mongoose = require('mongoose');
// -=-=-=-=-=-=- create the course schema -=-=-=-=-=-=-=-
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
// -=-=-=-=-=-=- export course schema to be used by courseController -=-=-=-=-
module.exports = mongoose.model('Course', courseSchema);
