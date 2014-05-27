var pongApp = angular.module('pongApp', [
    'ngRoute',
    'pongController',
]);
 
pongApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
          templateUrl: 'pongPage.html',
          controller: 'PongControl'
      }).
      otherwise({
          redirectTo: '/'
      });
  }]);
