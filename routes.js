var router = require('express').Router();
var userCtrl = require('./backEndControllers/userController.js');
var courseCtrl = require('./backEndControllers/courseController.js');
var jwt = require('jsonwebtoken');
var mySpecialSecret = "ching";

// -=-=-=-=-=-=-=- users -=-=-=-=-=-=-=-=-

router.route('/users')
  .post(userCtrl.add)
  .get(userCtrl.find)

router.route('/user/:id')
  .get(userCtrl.findOne)
  .patch(userCtrl.update)
  .delete(userCtrl.delete)

router.route('/friends/:id')
  .get(userCtrl.findFriends)

function auth () {

}
// -=-=-=-=-=-=-=- courses -=-=-=-=-=-=-=-

router.route('/api/courses')
  .get(courseCtrl.search)

router.route('/api/course/:id')
  .get(courseCtrl.searchOne)


module.exports = router
