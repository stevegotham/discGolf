(function() {
  'use strict';
    angular.module('userController', [])
      .controller('userController', ['$http', '$stateParams','$window','$state', userFunc])

  function userFunc($http, $stateParams, $window, $state) {
    var userCtrl = this;

    userCtrl.info = true;
    userCtrl.date = new Date();
    userCtrl.showStats = true;
    userCtrl.action = "Show All Rounds";
    userCtrl.showStatsNow = function() {
      if(userCtrl.action === "Hide All Rounds") {
        userCtrl.action = "Show All Rounds"
      } else {
        userCtrl.action = "Hide All Rounds"
      }
      userCtrl.showStats = !userCtrl.showStats;
    }

    $http.get('/user/' + $stateParams.id)
      .then(function(response) {
        userCtrl.user = response.data;
        userCtrl.profileBestScore = 125;
        userCtrl.profileBestDate = "a rough day many years ago";
        userCtrl.profileBestCourse = "some God awful course"
        userCtrl.profileMost = 0;
        userCtrl.profileMostPlayed = 'Some God awful course';
        for(var i=0;i<userCtrl.user.courseInfo.length;i++) {
          if(userCtrl.user.courseInfo[i].stats.length > userCtrl.profileMost) {
            userCtrl.profileMost = userCtrl.user.courseInfo[i].stats.length;
            userCtrl.profileMostPlayed = userCtrl.user.courseInfo[i].name;
          }
          for(var ii=0;ii<userCtrl.user.courseInfo[i].stats.length;ii++) {
            if(userCtrl.user.courseInfo[i].stats[ii].score < userCtrl.profileBestScore) {
              userCtrl.profileBestScore = userCtrl.user.courseInfo[i].stats[ii].score;
              userCtrl.profileBestCourse = userCtrl.user.courseInfo[i].name;
              userCtrl.profileBestDate = userCtrl.user.courseInfo[i].stats[ii].date;
            }
          }
        }
      })
    userCtrl.viewStats = function(course) {
      // $http.get('/user/' + $stateParams.id)
      //   .then(function(response) {
      //     userCtrl.user = response.data;
      //   });
      userCtrl.info = !userCtrl.info;
      userCtrl.currentCourse = course;
      userCtrl.bestScore = 125;
      userCtrl.bestDate = "a rough day, many years ago";

      for(var i=0;i<userCtrl.user.courseInfo.length;i++) {
        if(userCtrl.user.courseInfo[i].name === course.name) {
          userCtrl.currentCourse = userCtrl.user.courseInfo[i];
          for(var ii=0;ii<userCtrl.user.courseInfo[i].stats.length;ii++) {
            if(userCtrl.user.courseInfo[i].stats[ii].score < userCtrl.bestScore) {
              userCtrl.bestScore = userCtrl.user.courseInfo[i].stats[ii].score;
              userCtrl.bestDate = userCtrl.user.courseInfo[i].stats[ii].date;
            }
          }
        }
      }
    }
    userCtrl.backButton = function() {

      userCtrl.info = !userCtrl.info;
      userCtrl.showStats = true;
      userCtrl.action = "Show All Rounds";
    }
      // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- function to update user stats in database
    userCtrl.submitStats = function(course) {
      userCtrl.info = !userCtrl.info;
      if(userCtrl.date === null) {
        userCtrl.date = new Date();
      }
      $http({
        method: 'PATCH',
        url: '/user/:id',
        data: {
          name: course.name,
          stats: [{
            date: userCtrl.date,
            score: userCtrl.score
          }]
        }
      }).then(function(response) {
            userCtrl.user = response.data;
            for(var i=0;i<userCtrl.user.courseInfo.length;i++) {
              if(userCtrl.user.courseInfo[i].stats.length > userCtrl.profileMost) {
                userCtrl.profileMost = userCtrl.user.courseInfo[i].stats.length;
                userCtrl.profileMostPlayed = userCtrl.user.courseInfo[i].name;
              }
              for(var ii=0;ii<userCtrl.user.courseInfo[i].stats.length;ii++) {
                if(userCtrl.user.courseInfo[i].stats[ii].score < userCtrl.profileBestScore) {
                  userCtrl.profileBestScore = userCtrl.user.courseInfo[i].stats[ii].score;
                  userCtrl.profileBestCourse = userCtrl.user.courseInfo[i].name;
                  userCtrl.profileBestDate = userCtrl.user.courseInfo[i].stats[ii].date;
                }
              }
            }
        userCtrl.score = 0;
      })
    }
    userCtrl.deleteUser = function(user) {
      $http.delete('user/:id')
        .then(function(err, response) {
          if(err) console.log('err', err);
          $window.localStorage.removeItem('token')
          $window.localStorage.removeItem('_id')
          $state.go('home');
        })
    }
    userCtrl.logOut = function() {
      $window.localStorage.removeItem('token')
      $window.localStorage.removeItem('_id')
      $state.go('home')
    }


  }
}());
