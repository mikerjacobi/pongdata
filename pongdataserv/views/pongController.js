
var pongController = angular.module('pongController', ['ui.bootstrap']);

pongController.controller('PongControl', ['$scope', '$http', '$q', 
    function PongControl($scope, $http, $q) {
        $scope.base_url = 'http://ec2-54-186-165-220.us-west-2.compute.amazonaws.com:8086';

        $scope.init = function(){
        };
        
        $scope.init();
    }]);

