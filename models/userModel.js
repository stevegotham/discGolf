var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var userSchema = mongoose.Schema({
  name : {type: String},
  username : {type: String, required: true, unique: true},
  email : {type: String, required: true, unique: true},
  password : {type: String, required: true},
  deleted : {type: Boolean, default: false},
  friends : [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  favCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
});

userSchema.pre('save', function(next) {
  var user = this;
  if(!user.isModified('password')) return next();
  bcrypt.genSalt(11, function(error, salt){
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(password) {
  var user = this;
  return bcrypt.compareSync(password, user.password);
};

module.exports = mongoose.model('User', userSchema);
