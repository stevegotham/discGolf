var User = require('../models/userModel.js');

module.exports = {

  add : function(req, res) {
    var newUser = new User(req.body);
    newUser.save(function(err, user) {
      if(err) return res.send(err);
      res.send(user);
    });
  },
  find : function(req, res) {
    User.find({deleted: false}, function(err, users) {
      if(err) return res.send(err);
      res.send(users)
    });
  },
  findOne : function(req, res) {
    User.findById({_id: req.params.id}, function(err, user) {
      if(err) return res.send(err);
      res.send(user);
    })
  },
  update : function(req, res) {
    User.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, function(err, user) {
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
