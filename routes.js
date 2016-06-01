var router = require('express').Router();
var userCtrl = require('./backEndControllers/userController.js');
var courseCtrl = require('./backEndControllers/courseController.js')
// -=-=-=-=-=-=-=- users -=-=-=-=-=-=-=-=-
router.route('/users')
  .post(userCtrl.add)
  .get(userCtrl.find)

router.route('/users:id')
  .get(userCtrl.findOne)
  .patch(userCtrl.update)
  .delete(userCtrl.delete)

router.route('/friends:id')
  .get(userCtrl.findFriends)

// -=-=-=-=-=-=-=- courses -=-=-=-=-=-=-=-

router.route('/api/courses')
  .get(courseCtrl.search)

router.route('/api/course/:id')
  .get(courseCtrl.searchOne)


module.exports = router
