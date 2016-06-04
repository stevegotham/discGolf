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
  .controller('mainController',['$http','$state','$window','$rootScope', mainControl])

  function mainControl($http,$state,$window,$rootScope){
    var mainCtrl = this;

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
      if ($window.localStorage.getItem('token')) {
        mainCtrl.loggedIn = true;
        mainCtrl.loggedID = $window.localStorage.getItem('_id')
      } else {
        mainCtrl.loggedIn = false;
      }
    })
    mainCtrl.courseName = '';
    mainCtrl.courseCity = '';
    mainCtrl.courseState = '';
    mainCtrl.courseZip = '';
    mainCtrl.courses = [];
    mainCtrl.errMsg = '';
    mainCtrl.number = '';
    mainCtrl.courseResults = true;

// -=-=-=-=-=-=-=-=-=-= creates new user -=-=-=-=-=-=-=-=-=-=-=-=-=
    mainCtrl.register = function() {
      $http({
        method: 'POST',
        url: '/users',
        data: {
          name: mainCtrl.realName,
          username: mainCtrl.username,
          email: mainCtrl.email,
          password: mainCtrl.password
        }
      }).then(function(response) {
        console.log('res: ', response)
        if(response.data.code === 11000) {
          mainCtrl.errMsg = "There is already a user with that username";
        } else {
          $window.localStorage.setItem('token', response.data.token)
          $window.localStorage.setItem('_id', response.data.user._id)
          $state.go('profile', {id: response.data.user._id})
        }
      })
    }
// -=-=-=-=-=-=-=-=-=-=-= logges in a registered user -=-=-=-=-=-=-=-
    mainCtrl.login = function() {
      $http({
        method: "POST",
        url: '/user/:id',
        data: {
          username: mainCtrl.username,
          password: mainCtrl.password
        }
      }).then(function(response) {
        // console.log('login response', response)
        if(response.data.message) {
          mainCtrl.errMsg = response.data.message
        } else {
          $window.localStorage.setItem('token', response.data.token)
          $window.localStorage.setItem('_id', response.data.user._id)
          $state.go('profile', {id: response.data.user._id})
        }
      })
    }
// -=-=-=-=-=-=-=-=-=-=-=-=- searches database for course -=-=-=-=-=-=-=
    mainCtrl.search = function() {
      mainCtrl.courseResults = true;
      mainCtrl.errMsg = '';
      mainCtrl.courses = [];
      $http.get('/api/courses?name=' + mainCtrl.capitalize(mainCtrl.courseName) + '&city=' + mainCtrl.capitalize(mainCtrl.courseCity) + '&state=' + mainCtrl.courseState.toUpperCase() + '&zipCode=' + mainCtrl.courseZip)
        .then(function(returnData) {
          if(returnData.data.length>0) {
            mainCtrl.courses = returnData.data;
            mainCtrl.number = returnData.data.length;
            if(returnData.data.length>1) {
              mainCtrl.courseResults = false;
            }
          }
           else {
             mainCtrl.errMsg = "It appears there are no courses that fit that search"
           }
        })

    }
// -=-=-=-=-=-=- capitalizes first letter of city and course names for search
    mainCtrl.capitalize = function(str) {
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
