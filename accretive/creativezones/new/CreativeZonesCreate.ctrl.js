var creativeZonesModule = angular.module('marketplace.creativezones');

creativeZonesModule.controller('CreativeZoneCreateCtrl', 
  function ($scope, CreativeZone, Publisher, Rotation, Notification, $state) {

  $scope.CreativeZone = CreativeZone;
  $scope.Publisher = Publisher;
  $scope.Rotation = Rotation;
  $scope.newCZDetailsSwitch = true;
  $scope.Locations = CreativeZone.getLocations();

  $scope.newCreativeZone = {
    sfw: false,
    enabled: true,
    variant: -1
  };

  $scope.clear = function (){
    $scope.newCreativeZone = {
      sfw: false,
      enabled: true,
      variant: -1
    };
    $scope.newCZDetailsSwitch = true;
  };

  $scope.save = function (newCreativeZone) {
    
    var onError = function (response) {
      Notification.addHTTP(response);
    };
    var onSuccess = function(response){
      Notification.addNotification("You have successfully created Creative Zone" + "'" + response.name + "'", "success");
      //
      // Route the User to go to the publisher base page
      //
      $state.go("CreativeZonesUIRoot.single.info",{id:response.id});
    };
    CreativeZone.save(newCreativeZone).then(onSuccess,onError);
  };

  $scope.newCZDetailsSwitchCtrl = function(adtype){
    $scope.newCZDetailsSwitch = false;
    $scope.newCreativeZone.typeId = adtype;
  };

  $scope.newTempVarSwitchCtrl = function () {

  };

  Publisher.getPublishers();
  Rotation.getAllRotations();
});