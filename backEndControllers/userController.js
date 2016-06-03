var User            = require('../models/userModel.js');
var bcrypt          = require('bcryptjs');
var jwt             = require('jsonwebtoken');
var mySpecialSecret = "ching";

module.exports = {

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

  login: function(req, res) {
    console.log('for tony', req.body.password)
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

  findOne : function(req, res) {
    User.findById(req.params.id).populate('favCourses').exec(function(err, user) {
      if(err) return res.json({error: err});
      res.json(user);
    })
  },

  update : function(req, res) {
    if(req.body.favCourses) {
      User.findByIdAndUpdate(req.decoded._id, {$addToSet: {"favCourses":{_id: req.body.favCourses._id}}}, {new: true}, function(err, user) {
        if(err) return res.json({error: err});
        res.json(user);
      });
    } else if(req.body.courseName) {
      console.log("the req body", req.body)
      User.findById(req.decoded._id, function(err, user) {
        if(err) return res.json({error: err});
        for(var i=0;i<user.courseInfo.length;i++) {
          if(user.courseInfo[i].name !== req.body.courseName) {
            console.log('no course in array')
            // user.courseInfo.push(req.body)
          }
          if(user.courseInfo[i].name === req.body.courseName) {
            // user.courseInfo[i].stats = req.body.stats
            user.courseInfo[i].stats.push(req.body.stats)
          }
        }
        res.json(user)
      })
    }
  },

  delete : function(req, res) {
    User.findOneAndUpdate({_id: req.decoded._id}, {deleted: true, username: req.decoded._id}, function(err) {
      if(err) return res.send(err);
      res.json({message: "User has been deleted"});
    })
  },

  findFriends : function(req, res) {
    User.findById({_id: req.params.id}, function(err, user) {
      if(err) return res.send(err);
      var userFriends = []
      user.friends.forEach(function(friend) {
        User.findById({_id: friend.id}, function(err, user) {
          if(err) return res.send(err);
        });
      });
      res.json(userFriends);
    });
  },

}
