var sellCampaignsModule = angular.module('marketplace.sellcampaigns');

sellCampaignsModule.controller('SellCampaignRotationCtrl', 
  function ($scope, SellCampaign, Advertiser, Notification, AppConstants, $state, $stateParams, sellCampaign) {
    
    $scope.SellCampaign = SellCampaign;
    $scope.sellCampaign = sellCampaign;

});