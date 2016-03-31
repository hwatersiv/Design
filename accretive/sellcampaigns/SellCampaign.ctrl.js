var sellCampaignsModule = angular.module('marketplace.sellcampaigns');

sellCampaignsModule.controller('SellCampaignCtrl', 
  function ($scope, SellCampaign, $state, $stateParams, sellCampaign) {
  $scope.sellCampaign = sellCampaign.data; // the rotation injection is from the resolve function on the routes
  $scope.tabs = [
    { title: "Rotation",              route:"SellCampaignsUIRoot.single.rotation",          active:false },
    { title: "Rule Set",              route:"SellCampaignsUIRoot.single.ruleset",           active:false },
    { title: "Info",                  route:"SellCampaignsUIRoot.single.info",              active:true }
  ];

  $scope.go = function (tab) {
    $state.go(tab.route);
  };

  $scope.active = function(route){
    return $state.includes(route);
  };

});