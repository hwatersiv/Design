  var advertisersModule = angular.module('marketplace.advertisers');

  advertisersModule.controller('AdvertiserCtrl', [
  "$scope", "Advertiser", "$stateParams", function ($scope, Advertiser, $stateParams) {

  $scope.Advertiser = Advertiser;
  $scope.campaigns = [];
  // if we viewing an existing Advertiser load it from the APIR
  if ($stateParams.id) {
    Advertiser.getAdvertiser($stateParams.id).then(function(response) {
      $scope.advertiser = response;
    });

    Advertiser.getAdvertiserCampaigns($stateParams.id).then(function(res) {
      $scope.campaigns = res;
    });
  }

  $scope.tabs = [
    { title: "Advertiser Info", route:"AdvertisersUIRoot.single.info",     active:true },
    { title: "Sell Campaigns",    route:"AdvertisersUIRoot.single.campaigns", active:true}
  ];

}]);