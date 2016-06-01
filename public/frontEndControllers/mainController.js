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
    mc.errMsg = '';

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
          console.log('There was an error: ', response.data.errmsg)
        } else {
          $state.go('profile')
        }
      })
    }
// -=-=-=-=-=-=-=-=-=-=-= logges in a registered user -=-=-=-=-=-=-=-
    mc.login = function() {
      $http.get('/users?username=' + mc.username + '&password=' + mc.password).then(function(response) {
        if(response.data.length>0) {
          $state.go('profile', {id: response.data[0]._id})
        }
        else {
          mc.errMsg = "We couldn't find a user with those credentials"
        }
      })
    }
// -=-=-=-=-=-=-=-=-=-=-=-=- searches database for course -=-=-=-=-=-=-=
    mc.search = function() {
      mc.errMsg = '';
      mc.courses = [];
      $http.get('/api/courses?name=' + mc.capitalize(mc.courseName) + '&city=' + mc.capitalize(mc.courseCity) + '&state=' + mc.courseState.toUpperCase() + '&zipCode=' + mc.courseZip)
        .then(function(returnData) {
          if(returnData.data.length>0) {
            mc.courses = returnData.data
          }
           else {
             mc.errMsg = "It appears there are no courses that fit that search"
           }
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
