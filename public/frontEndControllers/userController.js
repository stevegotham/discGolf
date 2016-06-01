(function() {
  'use strict';
    angular.module('userController', [])
      .controller('userController', ['$http', '$stateParams', userFunc])

  function userFunc($http, $stateParams) {
    var mc = this;
    mc.user = {};
    $http.get('/user/' + $stateParams.id)
      .then(function(response) {
        console.log('logged in user: ', response)
        mc.user = response.data
      })
  }
}());
