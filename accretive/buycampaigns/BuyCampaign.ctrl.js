var orderModule = angular.module('marketplace.order');

orderModule.controller('BuyCampaignCtrl', 
  function ($scope, BuyCampaign, $stateParams, buyCampaign) {

  $scope.BuyCampaign = BuyCampaign;
  $scope.buyCampaign = buyCampaign;  // the buyCampaign injection is from the resolve function on the routes
  $scope.creativeZones = [];

  // if we viewing an existing BuyCampaign load it from the APIR
  if ($stateParams.id) {
    BuyCampaign.getBuyCampaignCreativeZones($stateParams.id).then(function(res) {
      $scope.creativeZones = res;
    });
  }

  $scope.tabs = [
    { title: "Buy Campaign Info", route:"BuyCampaignsUIRoot.single.info",     active:true },
    { title: "Creative Zones",    route:"BuyCampaignsUIRoot.single.invoices", active:false}
  ];

});
