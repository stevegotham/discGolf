(function() {
  'use strict';
  angular.module('mainController', [])
    .controller('mainController',['$http','$state', mainControl])

  function mainControl($http,$state){
    var mc = this;

    mc.register = function() {
      $http({
        method: 'POST',
        url: '/users',
        data: {
          name: mc.realName,
          username: mc.username,
          email: mc.email,
          password: mc.password
        }
      }).then(function (response) {
        if(response.data.errmsg) {
          console.log('shit', response.data.errmsg)
        } else {
          $state.go('profile')
        }
      })
      mc.realName = '';
      mc.username = '';
      mc.email = '';
      mc.password = '';
    }

    mc.search = function() {
      $http.get('/api/course')
        .then(function(returnData) {

        })

    }
  }
}());
