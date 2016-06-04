(function() {
  'use strict';
    angular.module('userController', [])
      .controller('userController', ['$http', '$stateParams','$window','$state', userFunc])

  function userFunc($http, $stateParams, $window, $state) {
    var uc = this;

    uc.info = true;
    uc.date = new Date();
    uc.showStats = true;
    uc.action = "Show All Rounds";
    uc.showStatsNow = function() {
      if(uc.action === "Hide All Rounds") {
        uc.action = "Show All Rounds"
      } else {
        uc.action = "Hide All Rounds"
      }
      uc.showStats = !uc.showStats;
    }

    $http.get('/user/' + $stateParams.id)
      .then(function(response) {
        uc.user = response.data;
        uc.profileBestScore = 125;
        uc.profileBestDate = "a rough day many years ago";
        uc.profileBestCourse = "some God awful course"
        uc.profileMost = 0;
        uc.profileMostPlayed = 'Some God awful course';
        for(var i=0;i<uc.user.courseInfo.length;i++) {
          if(uc.user.courseInfo[i].stats.length > uc.profileMost) {
            uc.profileMost = uc.user.courseInfo[i].stats.length;
            uc.profileMostPlayed = uc.user.courseInfo[i].name;
          }
          for(var ii=0;ii<uc.user.courseInfo[i].stats.length;ii++) {
            if(uc.user.courseInfo[i].stats[ii].score < uc.profileBestScore) {
              uc.profileBestScore = uc.user.courseInfo[i].stats[ii].score;
              uc.profileBestCourse = uc.user.courseInfo[i].name;
              uc.profileBestDate = uc.user.courseInfo[i].stats[ii].date;
            }
          }
        }
      })
    uc.viewStats = function(course) {
      // $http.get('/user/' + $stateParams.id)
      //   .then(function(response) {
      //     uc.user = response.data;
      //   });
      uc.info = !uc.info;
      uc.currentCourse = course;
      uc.bestScore = 125;
      uc.bestDate = "a rough day, many years ago";

      for(var i=0;i<uc.user.courseInfo.length;i++) {
        if(uc.user.courseInfo[i].name === course.name) {
          uc.currentCourse = uc.user.courseInfo[i];
          for(var ii=0;ii<uc.user.courseInfo[i].stats.length;ii++) {
            if(uc.user.courseInfo[i].stats[ii].score < uc.bestScore) {
              uc.bestScore = uc.user.courseInfo[i].stats[ii].score;
              uc.bestDate = uc.user.courseInfo[i].stats[ii].date;
            }
          }
        }
      }
    }
    uc.backButton = function() {

      uc.info = !uc.info;
      uc.showStats = true;
      uc.action = "Show All Rounds";
    }
      // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- function to update user stats in database
    uc.submitStats = function(course) {
      uc.info = !uc.info;
      if(uc.date === null) {
        uc.date = new Date();
      }
      $http({
        method: 'PATCH',
        url: '/user/:id',
        data: {
          name: course.name,
          stats: [{
            date: uc.date,
            score: uc.score
          }]
        }
      }).then(function(response) {
        console.log('da res', response.data)
            uc.user = response.data;
            for(var i=0;i<uc.user.courseInfo.length;i++) {
              if(uc.user.courseInfo[i].stats.length > uc.profileMost) {
                uc.profileMost = uc.user.courseInfo[i].stats.length;
                uc.profileMostPlayed = uc.user.courseInfo[i].name;
              }
              for(var ii=0;ii<uc.user.courseInfo[i].stats.length;ii++) {
                if(uc.user.courseInfo[i].stats[ii].score < uc.profileBestScore) {
                  uc.profileBestScore = uc.user.courseInfo[i].stats[ii].score;
                  uc.profileBestCourse = uc.user.courseInfo[i].name;
                  uc.profileBestDate = uc.user.courseInfo[i].stats[ii].date;
                }
              }
            }
        uc.score = 0;
      })
    }
    uc.deleteUser = function(user) {
      $http.delete('user/:id')
        .then(function(err, response) {
          if(err) console.log('err', err);
          $window.localStorage.removeItem('token')
          $window.localStorage.removeItem('_id')
          $state.go('home');
        })
    }
    uc.logOut = function() {
      $window.localStorage.removeItem('token')
      $window.localStorage.removeItem('_id')
      $state.go('home')
    }


  }
}());
