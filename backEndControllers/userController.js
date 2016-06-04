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
    } else if(req.body.name) {
      User.findById(req.decoded._id, function(err, user) {
        if(err) return res.json({error: err});
        if(user.courseInfo.length === 0) {
          user.courseInfo.push(req.body)
          user.save(function(err, user) {
            if(err) return res.json(err);
            res.json(user);
          });
        } else {
          for(var i=user.courseInfo.length-1;i>-1;i--) {
            if(user.courseInfo[i].name === req.body.name) {
              var hmmm = user.courseInfo[i].stats.push(req.body.stats[0]);
              console.log('hmmm', hmmm)
              console.log(user.courseInfo)
              user.markModified('courseInfo[i].stats');
              user.save(function(err, user) {
                if(err) return res.json(err);
                return res.json(user);
              });
            }
            else {
              var newCourse = {
                name: req.body.name,
                stats: {
                  score: req.body.stats[0].score,
                  date: req.body.stats[0].date
                }
              }
              user.courseInfo.push(newCourse);
              user.markModified('stats');
              user.save(function(err, user) {
                if(err) return res.json(err);
                res.json(user);
              });
            }
          }
        }

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
