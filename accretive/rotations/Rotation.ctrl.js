var rotationsModule = angular.module('marketplace.rotations');

rotationsModule.controller('RotationCtrl', 
  function ($scope, Rotation, $state, $stateParams, oneRotation) {
  $scope.rotation = oneRotation.data; // the rotation injection is from the resolve function on the routes
  $scope.tabs = [
    { title: "Info",              route:"RotationsUIRoot.single.info",          active:true }
  ];

  $scope.go = function (tab) {
    $state.go(tab.route);
  };

  $scope.active = function(route){
    return $state.includes(route);
  };

});

  