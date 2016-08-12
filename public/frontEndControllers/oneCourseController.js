(function() {
  'use strict';
    angular.module('oneCourseController', ['ngMap'])
      .controller('oneCourseController', ['$http', '$stateParams', '$sce','$window','NgMap','$state', oneCourseFunction])

  function oneCourseFunction($http,$stateParams,$sce,$window,NgMap,$state) {
    var oneCourseCtrl = this;
    oneCourseCtrl.course = {};
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= this variable is used to parse the descriptions of courses from database -=-=-=-=-
    oneCourseCtrl.sce = $sce;
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- function to add course to player's array of courses -=-=-=-=-=-=-=-=-=-=-=-=-=
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
          $state.go('profile',{id: $window.localStorage._id})
        })
      }
    }
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= function to retrieve a single course from database -=-=-=-=-=-=-=-=-=-=-=-=-=
    $http.get('/api/course/' + $stateParams.id)
      .then(function(response) {
        oneCourseCtrl.course = response.data
      })
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- map -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    NgMap.getMap();
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- closing tags -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  }
}());
