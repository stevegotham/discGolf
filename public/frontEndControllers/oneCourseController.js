(function() {
  'use strict';
    angular.module('oneCourseController', [])
      .controller('oneCourseController', ['$http', '$stateParams', '$sce','$window', oneCourseFunction])

  function oneCourseFunction($http,$stateParams,$sce,$window) {
    var oneCourseCtrl = this;
    oneCourseCtrl.addFav = function(course) {
      if(!$window.localStorage.token) {
        oneCourseCtrl.errMsg = "You must be logged in to add courses you've played"
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
    oneCourseCtrl.course = {};
    oneCourseCtrl.sce = $sce;

    $http.get('/api/course/' + $stateParams.id)
      .then(function(response) {
        oneCourseCtrl.course = response.data
      })
  }
}());
