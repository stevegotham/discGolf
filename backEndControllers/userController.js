var User = require('../models/userModel.js');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
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
  find : function(req, res) {
    var query = {};
    query.username = req.query.username;
    User.findOne(query).select('username email password').exec(function(err, user) {
      if(err) return res.json({error: err});
      if(!user) return res.json({message: 'No user found'});
      var validPw = user.comparePassword(req.query.password);
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
    console.log('req.body: ', req.body.favCourses._id)
    User.findByIdAndUpdate(req.decoded._id, {$push:{"favCourses":{_id: req.body.favCourses._id}}}, {new: true}, function(err, user) {
      if(err) return res.send(err);
      res.send(user);
    });
  },
  delete : function(req, res) {
    User.findOneAndUpdate({_id: req.params.id}, {deleted: true, username: ''}, function(err) {
      if(err) return res.send(err);
      res.send({message: "User has been deleted"});
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
