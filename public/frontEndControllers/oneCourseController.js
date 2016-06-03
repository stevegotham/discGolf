(function() {
  'use strict';
    angular.module('oneCourseController', [])
      .controller('oneCourseController', ['$http', '$stateParams', '$sce','$window', oneCourseFunction])

  function oneCourseFunction($http,$stateParams,$sce,$window) {
    var mc = this;
    mc.addFav = function(course) {
      if(!$window.localStorage.token) {
        mc.errMsg = "You must be logged in to add courses you've played"
      }
      else {
        $http({
          method: 'PATCH',
          url: '/user/'+ $window.localStorage._id,
          data: {
            favCourses: course
          }
        }).then(function(response) {
        })
      }
    }
    mc.course = {};
    mc.sce = $sce;

    $http.get('/api/course/' + $stateParams.id)
      .then(function(response) {
        mc.course = response.data
      })
  }
}());
