var advertisersModule = angular.module('marketplace.advertisers');
  advertisersModule.controller('AdvertisersCreateCtrl', function ($scope, Advertiser, Notification, $state, $stateParams) {

  $scope.advertiser = {
    id: null,
    name: ""
  };
  // for the create page open in edit mode
  $scope.buyOrderEdit = true;
  $scope.saveNewAdvertiser = function(advertiser){
    advertiser.enabled = true;
    advertiser.versionNumber = Date.now();
    Advertiser.save(advertiser).then(function(res){
      Notification.addNotification("You have successfully created Advertiser " + "'" + res.name + "'", "success");
      $state.go("AdvertisersUIRoot.single.info", {id: res.id});
    });
  };
});