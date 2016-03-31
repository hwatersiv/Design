var publishersModule = angular.module('marketplace.publishers');

publishersModule.controller('PublisherCtrl', 
  function ($scope, Publisher, CreativeZone, $state, $stateParams, publisher) {

  $scope.pub = publisher; // the publisher injection is from the resolve function on the routes
  $scope.pubZones = [];
  $scope.tabs = [
    { title: "Creative Zones",    route:"PublishersUIRoot.single.zones",    active:true },
    { title: "Info",              route:"PublishersUIRoot.single.info",     active:false}
  ];

  // if we viewing an existing Publisher load it from the APIR
  if ($stateParams.id) {
    Publisher.getCreativeZones($stateParams.id).then(function (res) {
      $scope.pubZones = res;
    });
  }

  $scope.go = function (tab) {
    $state.go(tab.route);
  };

  $scope.active = function(route){
    return $state.includes(route);
  };

});

  