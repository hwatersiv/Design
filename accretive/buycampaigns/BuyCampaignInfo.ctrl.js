var orderModule = angular.module('marketplace.order');

orderModule.controller('BuyCampaignInfoCtrl', 
  function ($scope, BuyCampaign, Publisher, $state, $stateParams) {

  $scope.BuyCampaign = BuyCampaign;
  $scope.pubCreativeZones = [];
  $scope.Publisher = Publisher;
  $scope.newOrder = {};
  $scope.buyOrderEdit = false;
  $scope.deleteAlert = false;
  $scope.delConfirmLineItem = false;
  $scope.editOrderId = null;
  $scope.addOrder = false;
  $scope.orders = $scope.buyCampaign.orders;
  $scope.from = null;
  $scope.level = {
    PUB: 1,
    CZ: 2,
  };

  $scope.orders = $scope.buyCampaign.orders; 

  /////////////////////////
  //// Buy Campaign methods
  /////////////////////////
  $scope.save = function(buyCampaign) {
    BuyCampaign.save(buyCampaign).then(
      function(res) {
        $scope.buyCampaign = buyCampaign;
        $scope.buyOrderEditSwitch();
      },
      function(res) {
        // todo: better
        $scope.error = 'Problem saving buy campaign.';
      });
  };

  $scope.deleteBuyCampaign = function(id){
    BuyCampaign.delete(id).then(function(res){
      $state.go('BuyCampaignsUIRoot.index', {msg: res});
    })
  }
  /////////////////////////
  //// Line Item methods
  /////////////////////////
  $scope.saveLineItem = function(order){
    order.buyCampaignId = $stateParams.id;

    BuyCampaign.saveLineItem(order).then(function(res){
      return BuyCampaign.getBuyCampaign($stateParams.id).then(function (buyCampaign){
        $scope.buyCampaign = buyCampaign;
        $scope.orders = buyCampaign.orders;
        $scope.getTotalCost($scope.orders);
      })
    });
    $scope.newOrder = {};
    $scope.addOrder = false;
    $scope.editSwitchCtrl();
  }

  $scope.delLineitem = function(id){
    BuyCampaign.deleteLineItem(id).then(function(res){
      return BuyCampaign.getBuyCampaign($stateParams.id).then(function (buyCampaign){
        $scope.buyCampaign.orders = buyCampaign.orders;
      })
    })
  };

  $scope.getCreativeZonesOnPubId = function (id) {
    Publisher.getCreativeZones(id).then(function(res){
      var filteredCZ = res.data;

      //For loop compares buy campaign orders to publisher creative zone list 
      //and removes the creative zone from the publisher creative zone list
      $scope.buyCampaign.orders.forEach(function (order){
        filteredCZ.forEach(function (cz) {
          if(order.creativeZoneId == cz.id){
            filteredCZ.splice(cz,1);
          }
        })
      });

      $scope.pubCreativeZones = filteredCZ;
    })
  };

  $scope.buyOrderInit = function (level) {
    switch (level) {
      case $scope.level.PUB:
        $scope.newOrder.creativeZoneId = null;
        $scope.newOrder.costTypeId = null;
        break;
      case $scope.level.CZ:
        $scope.newOrder.costTypeId = null;
        break;
      default:
        break;
    }
  }
  $scope.buyOrderTypeSwitch = function (buyTypeId) {
    $scope.startDate = true;
    $scope.days = true;
    $scope.endDate = true;
    $scope.count = true;
    $scope.cost = true;

    switch (buyTypeId){
      case BuyCampaign.costTypes.CPC:
        $scope.days = false;
        $scope.endDate = false;
        $scope.count = false;
        break;
      case BuyCampaign.costTypes.CPM:
        $scope.days = false;
        $scope.endDate = false;
        break;
      case BuyCampaign.costTypes.IMPRESSIONS:
        $scope.days = false;
        $scope.endDate = false;
        break;
      case BuyCampaign.costTypes.FLATRATE:
        $scope.endDate = false;
        $scope.count = false;
        break;
      case BuyCampaign.costTypes.FREE:
        break;
      case BuyCampaign.costTypes.ADDON:
        break;
      default:
        break;
    }
  };

  $scope.calcDate = function (days, from) {
    $scope.from = from;
    var oneUnixDay = 86400000;
    var calDate = days * oneUnixDay;

    if(from == 'start'){
      var start = Date.parse($scope.newOrder.expectedStartDate);
      var end = start + calDate;
      if(days){
        $scope.newOrder.expectedEndDate = new Date(end);
      }
    }
    if(from == 'end'){
      var end = Date.parse($scope.newOrder.expectedEndDate);
      var start = end - calDate;
      if(days){
        $scope.newOrder.expectedStartDate = new Date(start);

      }
    } 
  };

  $scope.buyOrderEditSwitch = function() {
    $scope.buyOrderEdit = !$scope.buyOrderEdit;
  };

  $scope.editSwitchCtrl = function(order) {
    if(!order){
      $scope.editOrderId = null;
    }else{
      $scope.editOrderId = order.id;
    }
  };

  $scope.createOrderSwitch = function () {
    $scope.newOrder = {};
    $scope.pubCreativeZones = [];
    $scope.addOrder = !$scope.addOrder;
  };

  $scope.getTotalCost = function(orders){
    var cost = 0;
    angular.forEach(orders, function(order,idx){
      cost += parseFloat(order.cost);
    });
    $scope.totalCost = cost;
  };

  Publisher.getPublishers();
  $scope.getTotalCost($scope.orders);
});
