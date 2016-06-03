(function() {
  'use strict';
  angular.module('mainController', [])
  .run(function ($rootScope, $state, $window) {
      $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        if(toState.authenticate) {
              if (!$window.localStorage.getItem('token')) {
                $state.transitionTo('login')
                event.preventDefault()
              }
        }
      })
  })
  .controller('mainController',['$http','$state','$window', mainControl])

  function mainControl($http,$state,$window){
    var mc = this;

    mc.courseName = '';
    mc.courseCity = '';
    mc.courseState = '';
    mc.courseZip = '';
    mc.courses = [];
    mc.errMsg = '';
    mc.number = '';
    mc.courseResults = true;
    mc.loggedIn = true;

// -=-=-=-=-=-=-=-=-=-= creates new user -=-=-=-=-=-=-=-=-=-=-=-=-=
    mc.register = function() {
      $http({
        method: 'POST',
        url: '/users',
        data: {
          name: mc.realName.toLowerCase(),
          username: mc.username.toLowerCase(),
          email: mc.email.toLowerCase(),
          password: mc.password.toLowerCase()
        }
      }).then(function(response) {
        console.log('res: ', response)
        if(response.data.errmsg) {
          console.log('There was an error: ', response.data.errmsg)
        } else {
          mc.loggedIn = true;
          $window.localStorage.setItem('token', response.data.token)
          $state.go('profile', {id: response.data.user._id})
        }
      })
    }
// -=-=-=-=-=-=-=-=-=-=-= logges in a registered user -=-=-=-=-=-=-=-
    mc.login = function() {
      $http.get('/users?username=' + mc.username.toLowerCase() + '&password=' + mc.password.toLowerCase()).then(function(response) {
        console.log('here is the response: ', response)
        if(!response.data.message) {
          mc.loggedIn = true;
          $window.localStorage.setItem('token', response.data.token)
          $window.localStorage.setItem('_id', response.data.user._id)
          $state.go('profile', {id: response.data.user._id})
        }
        else mc.errMsg = response.data.message
      })
    }
// -=-=-=-=-=-=-=-=-=-=-=-=- searches database for course -=-=-=-=-=-=-=
    mc.search = function() {
      mc.courseResults = true;
      mc.errMsg = '';
      mc.courses = [];
      $http.get('/api/courses?name=' + mc.capitalize(mc.courseName) + '&city=' + mc.capitalize(mc.courseCity) + '&state=' + mc.courseState.toUpperCase() + '&zipCode=' + mc.courseZip)
        .then(function(returnData) {
          if(returnData.data.length>0) {
            mc.courses = returnData.data;
            mc.number = returnData.data.length;
            mc.courseResults = false;
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
