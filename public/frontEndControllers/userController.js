(function() {
  'use strict';
    angular.module('userController', ['chart.js'])
      .controller('userController', ['$http', '$stateParams','$window','$state', userFunc])

  function userFunc($http, $stateParams, $window, $state) {
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
    userCtrl.action = "Show All Rounds";
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- queries database for user info to display in profile view -=-=-=-=-=-=-=-=-=-=-
    $http.get('/user/' + $stateParams.id)
      .then(function(response) {
        userCtrl.user = response.data;
        userCtrl.profileBestScore = 25;
        userCtrl.profileBestDate = "a rough day many years ago";
        userCtrl.profileBestCourse = "Some God-awful course"
        userCtrl.profileMost = 0;
        userCtrl.profileMostPlayed = 'Some God-awful course';
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
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- updates course-info variables to display in stats view -=-=-=-=-=-=-=
    userCtrl.viewStats = function(course) {
      userCtrl.info = !userCtrl.info;
      userCtrl.currentCourse = course;
      userCtrl.bestScore = 25;
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
      // userCtrl.graphInfo();
      function order (str) {
        var tempArr = [];
        var returnStr = str.split('-');
        tempArr.push(returnStr[1],returnStr[2],returnStr[0]);
        return tempArr.join('-');
      }
      userCtrl.getData = (function() {
        var orderedStats = [];
        for(var i=0;i<userCtrl.currentCourse.stats.length;i++) {
          var date = userCtrl.currentCourse.stats[i].date.slice(0,userCtrl.currentCourse.stats[i].date.indexOf('T'));
          orderedStats.push({date: order(date), score: userCtrl.currentCourse.stats[i].score})
        };
        console.log(orderedStats[0].date)
        orderedStats.sort(function(a,b){
          if(a.date<b.date) {
            return -1;
          }
          if(a.date>b.date) {
            return 1;
          }
          return 0;
        });
        var labels = [];
        var data = [];
        for (var i=0;i<orderedStats.length;i++) {
          labels.push(orderedStats[i].date);
          data.push(orderedStats[i].score);
        }
        userCtrl.labels = labels;
        userCtrl.data = data;
      }());
    }
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- swap value of 'userCtrl.action' variable -=-=-=-=-=-=-=-=-=-
    // userCtrl.swapAction = function() {
    //   if(userCtrl.action === "Hide All Rounds") {
    //     userCtrl.action = "Show All Rounds"
    //   } else {
    //     userCtrl.action = "Hide All Rounds"
    //   }
    //   userCtrl.showStats = !userCtrl.showStats;
    // }
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- reset variables to update view -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    userCtrl.backButton = function() {
      userCtrl.info = !userCtrl.info;
      userCtrl.showStats = true;
      userCtrl.action = "Show All Rounds";
    }
      // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- function to update user stats in database -=-=-=-=-=-=-=-=-=-=-
    userCtrl.submitStats = function(course) {
      userCtrl.info = !userCtrl.info;
      userCtrl.showStats = true;
      userCtrl.action = "Show All Rounds";
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
        userCtrl.score = null;
      })
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
