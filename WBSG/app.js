var app = angular.module('plunker', []);

app.controller('MainCtrl', ['$scope', '$http', function($scope, $http, $filter){

  $scope.test = "Test Successful!";
  
}]);

// //loginController-js 
// var app = angular.module('myApp');
// app.controller('LoginController', function($scope, $rootScope, $stateParams, $state, LoginService) {
//    $scope.formSubmit = function() {
//      if(LoginService.login($scope.username, $scope.password)) {
//        $rootScope.userName = $scope.username;
//        $scope.error = '';
//        $scope.username = '';
//        $scope.password = '';
//        $state.transitionTo('home');
//      } else {
//        $scope.error = "Incorrect username/password !";
//      }   
//    };    
//  });

