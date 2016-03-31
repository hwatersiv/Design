var creativeZonesModule = require('./index.js');

creativeZonesModule.controller('CreativeZonesCtrl',
  function ($scope, CreativeZone, Notification, $filter, $state, $stateParams) {

  $scope.$state = $state;
  $scope.CreativeZone = CreativeZone;
  $scope.Notification = Notification;

  CreativeZone.getAllCreativeZones();

});