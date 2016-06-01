(function() {
  'use strict';
    angular.module('oneCourseController', [])
      .controller('oneCourseController', ['$http','$state','$stateParams', '$sce', oneCtrlFunc])

  function oneCtrlFunc($http,$state,$stateParams,$sce) {
    var mc = this;

    mc.course = {};
    mc.sce = $sce;

    $http.get('/api/course/' + $stateParams.id)
      .then(function(response) {
        console.log(response)
        mc.course = response.data
      })
  }
}());
