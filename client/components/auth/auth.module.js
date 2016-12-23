'use strict';

angular.module('mwApp.auth', ['mwApp.constants', 'mwApp.util', 'ngCookies', 'ui.router'])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
