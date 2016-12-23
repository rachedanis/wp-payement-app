'use strict';

angular.module('mwApp', ['mwApp.auth', 'mwApp.admin', 'mwApp.constants', 'ngCookies', 'ngResource',
    'ngSanitize', 'btford.socket-io', 'ui.router', 'ui.bootstrap', 'validation.match'
  ])
  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode(true);
  });
