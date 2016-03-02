var sellCampaignsModule = require('./index.js');

sellCampaignsModule.controller('SellCampaignsCtrl',
  function ($scope, SellCampaign, Notification, $filter, $state, $stateParams) {

  $scope.$state = $state;
  $scope.SellCampaign = SellCampaign;
  $scope.Notification = Notification;

  SellCampaign.getAllSellCampaigns();
});