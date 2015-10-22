angular.module('core', [
  'core.service'
])
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push('HandlerInterceptor');
  });
