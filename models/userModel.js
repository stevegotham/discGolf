var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  name : {type: String},
  username : {type: String, required: true, unique: true},
  email : {type: String, required: true, unique: true},
  password : {type: String, required: true},
  deleted : {type: Boolean, default: false},
  friends : {type: Array}
});

module.exports = mongoose.model('User', userSchema);
