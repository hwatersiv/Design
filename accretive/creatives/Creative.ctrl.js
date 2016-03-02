  var creativesModule = angular.module('marketplace.creatives');
  creativesModule.controller('CreativeCtrl', function ($scope, Creative, $stateParams) {
  $scope.Creative = Creative;
  // if we viewing an existing Creative load it from the APIR
  $scope.tabs = [
    { title: "Creative Info", route:"CreativeUIRoot.single.info", active:true }
  ];
});