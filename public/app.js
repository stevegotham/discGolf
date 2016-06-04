(function() {
  'use strict';
  angular.module('discGolfApp', ['ui.router','mainController','oneCourseController', 'userController'])
    .config(routerConfig)
    .factory('AuthInterceptor', function($q, $location, $window) {

	var interceptorFactory = {};
	// this will happen on all HTTP requests
	interceptorFactory.request = function(config) {
		// grab the token
		var token = $window.localStorage.getItem('token');
		// if the token exists, add it to the header as x-access-token
		if (token){
			config.headers['x-access-token'] = token;
    }
		return config;
	};
	// happens on response errors
	interceptorFactory.responseError = function(response) {
		// if our server returns a 403 forbidden response
		if (response.status == 403) {
			$window.localStorage.removeItem('token')
			$location.path('/login');
		}
		// return the errors from the server as a promise
		return $q.reject(response);
	};
	return interceptorFactory;
})
    function routerConfig($stateProvider,$urlRouterProvider,$httpProvider){

      $httpProvider.interceptors.push('AuthInterceptor');

      $stateProvider
        .state('home', {
          url: '/',
          templateUrl: 'html/home.html',
          controller: 'mainController as mainCtrl'
        })
        .state('login', {
          url: '/login',
          templateUrl: 'html/login.html',
          controller: 'mainController as mainCtrl'
        })
        .state('register', {
          url: '/register',
          templateUrl: 'html/register.html',
          controller: 'mainController as mainCtrl'
        })
        .state('profile', {
          url: '/user/:id',
          templateUrl: 'html/profile.html',
          controller: 'userController as userCtrl'
        })
        .state('search', {
          url: '/search',
          templateUrl: 'html/search.html',
          controller: 'mainController as mainCtrl'
        })
        .state('course', {
          url: '/course/:id',
          templateUrl: 'html/course.html',
          controller: 'oneCourseController as oneCourseCtrl'
        })
        .state('user', {
          url: '/user/:id',
          templateUrl: 'html/profile.html',
          controller: 'userController as userCtrl'
        })

        $urlRouterProvider.otherwise('/')
    }
}());
