var creativeZonesModule = angular.module('marketplace.creativezones');

creativeZonesModule.controller('CreativeZoneCtrl', 
  function ($scope, CreativeZone, $state, $stateParams, creativeZone) {

  $scope.creativeZone = creativeZone; // the Creative Zone injection is from the resolve function on the routes
  $scope.tabs = [
    { title: "Rotations",         route:"CreativeZonesUIRoot.single.rotations",     active:true  },
    { title: "Info",              route:"CreativeZonesUIRoot.single.info",          active:false }
  ];

  // if we viewing an existing Publisher load it from the APIR
  // if ($stateParams.id) {
  //   CreativeZone.getCreativeZones($stateParams.id).then(function (res) {
  //     $scope.pubZones = res;
  //   });
  // }

  $scope.go = function (tab) {
    $state.go(tab.route);
  };

  $scope.active = function(route){
    return $state.includes(route);
  };

});

  