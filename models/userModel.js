// -=-=-=-=-=-=- variables and requires -=-=-=-=-=-=-=-
var mongoose = require('mongoose');
var bcrypt   = require('bcryptjs');
// -=-=-=-=-=-=- create the user schema -=-=-=-=-=-=-=-
var userSchema = mongoose.Schema({
  name : {type: String},
  username : {type: String, required: true, unique: true},
  email : {type: String, required: true},
  password : {type: String, required: true},
  deleted : {type: Boolean, default: false},
  friends : [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  favCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  courseInfo: {type: Array}
});
// -=-=-=-=-=-=- function to hash passwords before storing -=-=-=-=-=-=-=-
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
// -=-=-=-=-=-=- function to validate user password -=-=-=-=-=-=-=-=-
userSchema.methods.comparePassword = function(password) {
  var user = this;
  return bcrypt.compareSync(password, user.password);
};
// -=-=-=-=-=-=- export user schema to be used by userController -=-=-=-=-
module.exports = mongoose.model('User', userSchema);
