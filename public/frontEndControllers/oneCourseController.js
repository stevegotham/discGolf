(function() {
  'use strict';
    angular.module('oneCourseController', [])
      .controller('oneCourseController', ['$http', '$stateParams', '$sce', oneCtrlFunc])

  function oneCtrlFunc($http,$stateParams,$sce) {
    var mc = this;

    mc.course = {};
    mc.sce = $sce;

    $http.get('/api/course/' + $stateParams.id)
      .then(function(response) {
        mc.course = response.data
      })
  }
}());
