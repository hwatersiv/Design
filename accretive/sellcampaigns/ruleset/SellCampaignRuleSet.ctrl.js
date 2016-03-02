var sellCampaignsModule = angular.module('marketplace.sellcampaigns');

sellCampaignsModule.controller('SellCampaignRuleSetCtrl', 
  function ($scope, SellCampaign, Advertiser, Notification, AppConstants, $state, $stateParams, sellCampaign) {
    
    $scope.SellCampaign = SellCampaign;
    $scope.sellCampaign = sellCampaign;


});