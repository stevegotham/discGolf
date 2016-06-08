// -=-=-=-=-=-=-=-=- variables and requires -=-=-=-=-=-=-=-=-=-=-
var User            = require('../models/userModel.js');
var bcrypt          = require('bcryptjs');
var jwt             = require('jsonwebtoken');
var mySpecialSecret = "ching";
// -=-=-=-=-=-=-=-=- the object/methods exported to routes.js -=-=-=-=-=-=
module.exports = {

// -=-=-=-=-=-=-=-=- add a user to the database -=-=-=-=-=-=-=-=-=-=-
  add : function(req, res) {
    var newUser = new User(req.body);
    newUser.save(function(err, user) {
      if(err) return res.json(err);
      var token = jwt.sign({
          username: user.username,
          email: user.email,
          _id: user._id
          }, mySpecialSecret, {
            expiresIn: "1 day"
        });
      res.json({user: user, token: token});
    });
  },
// -=-=-=-=-=-=-=-=- authenticate a user and retrieve from databse -=-=-=-=-=-
  login: function(req, res) {
    User.findOne({username: req.body.username}).select('username email password').exec(function(err, user) {
      if(err) return res.json({error: err});
      if(!user) return res.json({message: 'No user found'});
      var validPw = user.comparePassword(req.body.password);
      if(!validPw) return res.json({success: false, message: "Authentication failed, wrong password."});
      var token = jwt.sign({
          username: user.username,
          email: user.email,
          _id: user._id
          }, mySpecialSecret, {
            expiresIn: "1 day"
        });
      res.json({user: user, token : token});
    });
  },
// -=-=-=-=-=-=-=- retrieves user from database and populates favCourses array -=-=-=-=-=-=-=-=
  addCourse : function(req, res) {
    User.findById(req.params.id).populate('favCourses').exec(function(err, user) {
      if(err) return res.json({error: err});
      res.json(user);
    })
  },
// -=-=-=-=-=-=-=- retrieve user from database and update -=-=-=-=-=-=-=-
  update : function(req, res) {
    // -=-=-=-=-=- add course to favCourses array -=-=-=-=-=-=-=-=-=-=-=-
    if(req.body.favCourses) {
      User.findByIdAndUpdate(req.decoded._id, {$addToSet: {"favCourses":{_id: req.body.favCourses._id}}}, {new: true}, function(err, user) {
        if(err) return res.json({error: err});
        res.json(user);
      });
    }
    // -=-=-=-=-=- add stats to course in courseInfo array -=-=-=-=-=-=-=-
    else if(req.body.name) {
      User.findById(req.decoded._id).populate('favCourses').exec(function(err, user) {
        if(err) return res.json({error: err});
        // -=-=-=- if user has no courses add course from req.body -=-=-=-
        if(user.courseInfo.length === 0) {
          user.courseInfo.push(req.body);
          user.save();
          return res.json(user);
        } else {
          for(var i=user.courseInfo.length-1;i>-1;i--) {
            // -=-=- check if course exists, and add stats if so -=-=-=-=-=-
            if(user.courseInfo[i].name === req.body.name) {
              user.courseInfo[i].stats.push(req.body.stats[0]);
              user.markModified('courseInfo');
              user.save();
              return res.json(user);
            }
          }
          // -=-=-=- add course to array if not present -=-=-=-=-=-=-=-=-=-
          var newCourse = {
            name: req.body.name,
            stats: [{
              score: req.body.stats[0].score,
              date: req.body.stats[0].date
            }]
          }
          user.courseInfo.push(newCourse);
          user.markModified('courseInfo');
          user.save();
          return res.json(user);
        }
      })
    }
  },
// -=-=-=-=-=-=-=- mark "deleted" property on user to "true" -=-=-=-=-=-=
  delete : function(req, res) {
    User.findOneAndUpdate({_id: req.decoded._id}, {deleted: true, username: req.decoded._id}, function(err) {
      if(err) return res.send(err);
      res.json({message: "User has been deleted"});
    })
  },
}
