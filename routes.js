var router      = require('express').Router();
var userCtrl        = require('./backEndControllers/userController.js');
var courseCtrl      = require('./backEndControllers/courseController.js');
var jwt             = require('jsonwebtoken');
var mySpecialSecret = "ching";

// -=-=-=-=-=-=-=- courses -=-=-=-=-=-=-=-

router.route('/api/courses')
  .get(courseCtrl.search)

router.route('/api/course/:id')
  .get(courseCtrl.searchOne)


// -=-=-=-=-=-=-=- users -=-=-=-=-=-=-=-=-

router.route('/users')
  .post(userCtrl.add)
  .get(userCtrl.find)

router.use(function(req, res, next){
	var token = req.body.token || req.param('token') || req.headers['x-access-token']
	if(token){
		jwt.verify(token, mySpecialSecret, function(err, decoded){
			if(err){
				return res.status(403).send({success:false, message:"can't authenticate token"})
			} else {
				req.decoded = decoded;
				next()
			}
		})
	} else {
		return res.status(403).json({success: false, message: "no token provided"})
	}
})

router.route('/user/:id')
  .get(userCtrl.findOne)
  .patch(userCtrl.update)
  .delete(userCtrl.delete)

router.route('/friends/:id')
  .get(userCtrl.findFriends)

// -=-=-=-=-=-=-=-=- export -=-=-=-=-=-=-=-=-=

module.exports = router
