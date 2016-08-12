(function() {
  'use strict';
    angular.module('userController', ['chart.js'])
      .controller('userController', ['$http', '$stateParams','$window','$state','mainFactory', userFunc])

  function userFunc($http, $stateParams, $window, $state, mainFact) {
    var userCtrl = this;
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- chartjs options -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    Chart.defaults.global.elements.line.fill = false;
    Chart.defaults.global.elements.line.tension = .3;
    Chart.defaults.global.elements.line.borderWidth = 4;
    Chart.defaults.global.elements.line.borderColor = "#2BBBAD";
    Chart.defaults.global.elements.point.radius = 4;
    Chart.defaults.global.elements.point.borderColor = "#000";
    Chart.defaults.global.elements.point.backgroundColor = "#2BBBAD";
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- variables -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    userCtrl.info = true;
    userCtrl.date = new Date();
    userCtrl.showStats = true;
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- queries database for user info to display in profile view -=-=-=-=-=-=-=-=-=-=-
   $http.get('/user/' + $stateParams.id)
      .then(function(response) {
        var user = response.data;
        user.bestScore = 25;
        user.bestDate = "a rough day many years ago";
        user.bestCourse = "Some God-awful course"
        user.most = 0;
        user.mostPlayed = 'Some God-awful course';
        for(var i=0;i<user.courseInfo.length;i++) {
          if(user.courseInfo[i].stats.length > user.most) {
            user.most = user.courseInfo[i].stats.length;
            user.mostPlayed = user.courseInfo[i].name;
          }
          for(var ii=0;ii<user.courseInfo[i].stats.length;ii++) {
            if(user.courseInfo[i].stats[ii].score < user.bestScore) {
              user.bestScore = user.courseInfo[i].stats[ii].score;
              user.bestCourse = user.courseInfo[i].name;
              user.bestDate = user.courseInfo[i].stats[ii].date;
            }
          }
        }
        mainFact.user = user;
        userCtrl.user = user;
      })
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- updates course-info variables to display in stats view -=-=-=-=-=-=-=
    userCtrl.viewStats = function(course) {
      mainFact.currentCourse = course;
      $state.go('profileCourse');
    }
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- delete user -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    userCtrl.deleteUser = function(user) {
      $http.delete('user/:id')
        .then(function(err, response) {
          if(err) console.log('err', err);
          userCtrl.logOut();
        })
    }
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- log out -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    userCtrl.logOut = function() {
      $window.localStorage.removeItem('token')
      $window.localStorage.removeItem('_id')
      $state.go('home')
    }
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- closing tags -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  }
}());
