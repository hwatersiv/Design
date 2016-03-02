var rotationsModule = require('./index.js');

rotationsModule.controller('RotationsCtrl',
  function ($scope, Rotation, Notification, $filter, $state, $stateParams) {

  $scope.$state = $state;
  $scope.Rotation = Rotation;
  $scope.Notification = Notification;

  Rotation.getAllRotations();

});