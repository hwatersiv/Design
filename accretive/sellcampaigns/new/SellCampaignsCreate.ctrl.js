var sellCampaignsModule = angular.module('marketplace.sellcampaigns');

sellCampaignsModule.controller('SellCampaignsCreateCtrl', 
  function ($scope, SellCampaign, Rotation, Notification, $state, $stateParams) {

    $scope.Rotation = Rotation;
    $scope.newRotation = { enabled: true };

    $scope.save = function (newRotation) {
      Rotation.saveNewRotation(newRotation).then(function (res) {
        Notification.addNotification("You have successfully created Rotation" + "'" + res.data.name + "'", "success");
        //
        // Route the User to go to the publisher base page
        //
        $state.go("RotationsUIRoot.single.info",{id:res.data.id});
      });
    };

    $scope.clear = function () {
      $scope.newRotation = { enabled: true };
    };

    $scope.isImad = function () {
      if($scope.newRotation.creativeZoneType_id == Rotation.types.IMAD){
        $scope.newRotation.isHeterogeneous = true;
      }
      else{
        $scope.newRotation.isHeterogeneous = false;
      }
    };
});