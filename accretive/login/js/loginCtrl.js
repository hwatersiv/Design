var loginApp = angular.module('LoginApp');
loginApp.controller('LoginCtrl',
    ['$scope', '$stateParams', '$state', 'AuthService',function($scope, $stateParams, $state, AuthService){

    $scope.date = Date.now();
    $scope.message= "";

    $scope.login = function (user) {
       AuthService.login(user)
       .success(function(data, status, headers, config) {
       	 if(data.hasOwnProperty("error")){
       	 	$scope.message = 'Invalid username or password';
          return;
       	 }

        if ($stateParams.previous) {
          $state.go($stateParams.previous.name, $stateParams.previous.params);
        } else {
          $state.go('Publisher');
        }
       })
       .error(function(data, status, headers, config) {
       	 $scope.message = 'Invalid username or password';
       });
    };

    $scope.signup = function (user) {
      if ($scope.signupForm.$invalid) {
        return;
      }

      AuthService.signup(user)
        .success(function(data, status, headers, config) {
         if(data.hasOwnProperty("error")){
          $scope.message = data.Message;
          return;
        }

        $scope.login(user);
        })
        .error(function(data, status, headers, config) {
          $scope.message = 'Failed to create new user.';
          console.log(data)
        });
    };

 }]);