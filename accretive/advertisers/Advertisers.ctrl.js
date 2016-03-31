  var advertisersModule= angular.module('marketplace.advertisers',[
      'marketplace.entities'
      ]);

  advertisersModule.controller('AdvertisersCtrl', [
    "$scope", "Advertiser", "Notification", "$state", function ($scope, Advertiser, Notification, $state) {
      $scope.$state = $state;
      $scope.Notification = Notification;
      $scope.Advertiser = Advertiser;
      Advertiser.getAdvertisers();
}]);