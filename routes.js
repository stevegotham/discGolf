// -=-=-=-=-=-=-=- variables and requires -=-=-=-=-=-=-==-
var router          = require('express').Router();
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
router.route('/user/:id')
  .post(userCtrl.login)
// -=-=-=-=-=-=-=- everything below here gets authenticated -=-=-=-=-=-=-=-
// -=-=-=-=-=-=-=- authentication middleware -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
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
// -=-=-=-=-=-=-=-=-=-=-=- single user -=-=-=-=-=-=-=-=-=-
router.route('/user/:id')
  .get(userCtrl.addCourse)
  .patch(userCtrl.update)
  .delete(userCtrl.delete)
// -=-=-=-=-=-=-=-=- export -=-=-=-=-=-=-=-=-=

module.exports = router
