(function() {
  'use strict';
  angular.module('mainController', [])
    // .config(routerConfig)
    .controller('mainController',['$http', mainControl])

  function mainControl($http){
    var mc = this;

    mc.search = function() {
      $http.get('/api/course')
        .then(function(returnData) {
          console.log("course info: ", returnData)
        })

    }
  }
}());
