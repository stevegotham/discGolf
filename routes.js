var router = require('express').Router();
var userCtrl = require('./controllers/userController.js');

router.route('/api/users')
  .post(userCtrl.add)
  .get(userCtrl.find)

router.route('/api/users:id')
  .get(userCtrl.findOne)
  .patch(userCtrl.update)
  .delete(userCtrl.delete)
  
router.route('/api/friends:id')
  .get(userCtrl.findFriends)

module.exports = router
