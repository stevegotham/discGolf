(function() {
  'use strict';
    angular.module('userController', [])
      .controller('userController', ['$http', '$stateParams','$window','$state', userFunc])

  function userFunc($http, $stateParams, $window, $state) {
    var mc = this;

    mc.info = true;
    $http.get('/user/' + $stateParams.id)
      .then(function(response) {
        mc.user = response.data
      })
    mc.addStats = function(course) {
      mc.info = !mc.info
      mc.thisOne = course
    }

      // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- function to update user stats in database
    mc.submitStats = function(course) {
      mc.info = !mc.info
      $http({
        method: 'PATCH',
        url: '/user/:id',
        data: {
          courseName: course.name,
          stats: [{
            date: mc.date,
            score: mc.score
          }]
        }
      }).then(function(response) {
        console.log(response)
      })
    }
    mc.deleteUser = function(user) {
      $http.delete('user/:id')
        .then(function(err, response) {
          if(err) console.log('err', err);
          $window.localStorage.removeItem('token')
          $window.localStorage.removeItem('_id')
          $state.go('home');
        })
    }
    mc.logOut = function() {
      $window.localStorage.removeItem('token')
      $window.localStorage.removeItem('_id')
      $state.go('home')
    }


  }
}());
