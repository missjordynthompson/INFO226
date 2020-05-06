var app = angular.module('plunker', []);

app.controller('MainCtrl', ['$scope', '$http', function($scope, $http, $filter){
  $scope.test = "Test Successful!";
}]);

