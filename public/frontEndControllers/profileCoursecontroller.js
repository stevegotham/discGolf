(function() {
  'use strict';
  angular.module('profileCourseController', [])
    .controller('profileCourseController',['mainFactory','$http','$state', '$window',profileCourseFunc])

    function profileCourseFunc (mainFact,$http,$state,$window) {
      var profCtrl = this;

      profCtrl.current = mainFact;
      profCtrl.current.bestScore = 25;
      profCtrl.current.bestDate = "a rough day many years ago";
      profCtrl.current.bestCourse = "Some God-awful course"
      profCtrl.current.most = 0;
      profCtrl.current.mostPlayed = 'Some God-awful course';
      for(var i=0;i<profCtrl.current.user.courseInfo.length;i++) {
        if(profCtrl.current.user.courseInfo[i].name === profCtrl.current.currentCourse.name) {
          profCtrl.current.currentCourse = profCtrl.current.user.courseInfo[i];
          for(var ii=0;ii<profCtrl.current.user.courseInfo[i].stats.length;ii++) {
            if(profCtrl.current.user.courseInfo[i].stats[ii].score < profCtrl.current.bestScore) {
              profCtrl.current.bestScore = profCtrl.current.user.courseInfo[i].stats[ii].score;
              profCtrl.current.bestDate = profCtrl.current.user.courseInfo[i].stats[ii].date;
            }
          }
        }
      }
      profCtrl.current.getData = (function() {
        var orderedStats = [];
        if(profCtrl.current.currentCourse.stats === undefined) profCtrl.current.currentCourse.stats = [];
        for(var i=0;i<profCtrl.current.currentCourse.stats.length;i++) {
          orderedStats.push({date: profCtrl.current.currentCourse.stats[i].date, score: profCtrl.current.currentCourse.stats[i].score})
        };
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
          var date = new Date(orderedStats[i].date).toDateString().slice(4);
          labels.push(date);
          data.push(orderedStats[i].score);
        }
        profCtrl.labels = labels;
        profCtrl.data = data;
      }());
      // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- function to update user stats in database -=-=-=-=-=-=-=-=-=-=-
    profCtrl.submitStats = function(course) {
      $http({
        method: 'PATCH',
        url: '/user/:id',
        data: {
          name: course.name,
          stats: [{
            date: Date.parse(profCtrl.date),
            score: profCtrl.score
          }]
        }
      }).then(function(response) {
            profCtrl.current.user = response.data;
            for(var i=0;i<profCtrl.current.user.courseInfo.length;i++) {
              if(profCtrl.current.user.courseInfo[i].stats.length > profCtrl.current.profileMost) {
                profCtrl.current.profileMost = profCtrl.current.user.courseInfo[i].stats.length;
                profCtrl.current.profileMostPlayed = profCtrl.current.user.courseInfo[i].name;
              }
              for(var ii=0;ii<profCtrl.current.user.courseInfo[i].stats.length;ii++) {
                if(profCtrl.current.user.courseInfo[i].stats[ii].score < profCtrl.current.profileBestScore) {
                  profCtrl.current.profileBestScore = profCtrl.current.user.courseInfo[i].stats[ii].score;
                  profCtrl.current.profileBestCourse = profCtrl.current.user.courseInfo[i].name;
                  profCtrl.current.profileBestDate = profCtrl.current.user.courseInfo[i].stats[ii].date;
                }
              }
            }
        profCtrl.current.score = null;
      })
      $state.go('profile',{id: $window.localStorage._id})
    }
  }

}());
