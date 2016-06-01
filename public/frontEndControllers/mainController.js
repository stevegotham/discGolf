(function() {
  'use strict';
  angular.module('mainController', [])
    .controller('mainController',['$http','$state', mainControl])

  function mainControl($http,$state){
    var mc = this;

    mc.courseName = '';
    mc.courseCity = '';
    mc.courseState = '';
    mc.courseZip = '';
    mc.courses = [];
// -=-=-=-=-=-=-=-=-=-= creates new user -=-=-=-=-=-=-=-=-=-=-=-=-=
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
      }).then(function(response) {
        if(response.data.errmsg) {
          console.log('shit', response.data.errmsg)
        } else {
          $state.go('profile')
        }
      })
    }
// -=-=-=-=-=-=-=-=-=-=-=-=- searches database for course -=-=-=-=-=-=-=
    mc.search = function() {
      $http.get('/api/course?name=' + mc.capitalize(mc.courseName) + '&city=' + mc.capitalize(mc.courseCity) + '&state=' + mc.courseState.toUpperCase() + '&zipCode=' + mc.courseZip)
        .then(function(returnData) {
          console.log('return data: ', returnData)
          if(returnData.data.length>0) {
            mc.courses = returnData.data
          }
          else console.log('no courses')
        })

    }

// -=-=-=-=-=-=- capitalizes first letter of city and course names for search
    mc.capitalize = function(str) {
      var upper = function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
      var arr = str.split(' ');
      for (var i=0;i<arr.length;i++) {
        arr[i] = upper(arr[i])
      }
      return arr.join(' ')
    }
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=- closing tags =-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  }
}());
