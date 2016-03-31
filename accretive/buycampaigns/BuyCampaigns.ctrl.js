var orderModule= angular.module('marketplace.order',[
    'marketplace.entities'
]);

orderModule.controller('BuyCampaignsCtrl',
  function ($scope, BuyCampaign, Notification, $state) {
  $scope.$state = $state;
  $scope.Notification = Notification;
  $scope.BuyCampaign = BuyCampaign;
  BuyCampaign.getBuyCampaigns();
});