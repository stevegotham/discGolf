var router = require('express').Router();
var userCtrl = require('./backEndControllers/userController.js');
var courseCtrl = require('./backEndControllers/courseController.js')
// -=-=-=-=-=-=-=- users -=-=-=-=-=-=-=-=-
router.route('/api/users')
  .post(userCtrl.add)
  .get(userCtrl.find)

router.route('/api/users:id')
  .get(userCtrl.findOne)
  .patch(userCtrl.update)
  .delete(userCtrl.delete)

router.route('/api/friends:id')
  .get(userCtrl.findFriends)

// -=-=-=-=-=-=-=- courses -=-=-=-=-=-=-=-

router.route('/api/course')
  .get(courseCtrl.search)


module.exports = router
