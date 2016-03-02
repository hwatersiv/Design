var sellCampaignsModule = angular.module('marketplace.sellcampaigns');

sellCampaignsModule.controller('SellCampaignInfoCtrl', 
  function ($scope, SellCampaign, Creative, Advertiser, Notification, AppConstants, $state, $stateParams, sellCampaign) {
    
    $scope.deleteAlert = false;
    $scope.SellCampaign = SellCampaign;
    $scope.Notification = Notification;
    $scope.sellCampaign = sellCampaign;

    $scope.sellCampaignEditSwitch = function () {

    };

    Advertiser.getAdvertiser(sellCampaign.advertiserId).then(function (res) {
      $scope.sellCampaign.advertiserName = res.name;
    })

});