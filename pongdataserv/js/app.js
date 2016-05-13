var pongApp = angular.module('pongApp', [
    'ngRoute',
    'pongController',
]);
 
pongApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
          templateUrl: 'html/pongPage.html',
          controller: 'PongControl'
      }).
      otherwise({
          redirectTo: '/'
      });
  }]);
