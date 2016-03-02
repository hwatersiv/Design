  var creativesModule= angular.module('marketplace.creatives',[
      'marketplace.entities'
      ]);

  creativesModule.controller('CreativesCtrl', function ($scope, Creative, Notification, $state) {
      $scope.$state = $state;
      $scope.Notification = Notification;
      $scope.Creative = Creative;
      Creative.getCreatives();
  });