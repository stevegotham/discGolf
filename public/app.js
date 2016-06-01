(function() {
  'use strict';
  angular.module('discGolfApp', ['ui.router','mainController','oneCourseController'])
    .config(routerConfig)

    function routerConfig($stateProvider,$urlRouterProvider){

      $stateProvider
        .state('home', {
          url: '/',
          templateUrl: 'html/home.html',
          controller: 'mainController as mc'
        })
        .state('login', {
          url: '/login',
          templateUrl: 'html/login.html',
          controller: 'mainController as mc'
        })
        .state('register', {
          url: '/register',
          templateUrl: 'html/register.html',
          controller: 'mainController as mc'
        })
        .state('profile', {
          url: '/profile',
          templateUrl: 'html/profile.html',
          controller: 'mainController as mc'
        })
        .state('search', {
          url: '/search',
          templateUrl: 'html/search.html',
          controller: 'mainController as mc'
        })
        .state('course', {
          url: '/course/:id',
          templateUrl: 'html/course.html',
          controller: 'oneCourseController as mc'
        })

        $urlRouterProvider.otherwise('/')
    }
}());
