var advertisersModule = angular.module('marketplace.advertisers');

advertisersModule.controller('AdvertiserInfoCtrl', [
  "$scope", "Advertiser", "Notification", "Platform", "$state", "$stateParams", function ($scope, Advertiser, Notification, Platform, $state, $stateParams) {

  $scope.Advertiser = Advertiser;
  $scope.Notification = Notification;  
  $scope.newAdvertiser = {};
  $scope.advertiserEdit = false;
  $scope.deleteAlert = false;
  $scope.delConfirmLineItem = false;
  $scope.editAdvertiserId = null;
  $scope.addAdvertiser = false;
  /////////////////////////
  //// Advertiser methods
  /////////////////////////
  $scope.save = function(advertiser) {
    Advertiser.save(advertiser).then(
      function(res) {
        $scope.advertiser = advertiser;
        $scope.advertiserEditSwitch();
      },
      function(res) {
        //$scope.error = 'Problem saving Advertiser.';
        Notification.addNotification('Problem saving Advertiser.','error');
      });
  };

  $scope.deleteAdvertiser = function(id){
    Advertiser.delete(id).then(function(res){
      $state.go('AdvertisersUIRoot.index', {msg: res});
    })
  };
  /////////////////////////
  //// Line Item methods
  /////////////////////////
  $scope.saveLineItem = function(order){
    order.AdvertiserId = $stateParams.id;

    Advertiser.saveLineItem(order).then(function(res){
      return Advertiser.getAdvertiser($stateParams.id).then(function(Advertiser){
        $scope.Advertiser = Advertiser;
        $scope.orders = Advertiser.orders;
        $scope.getTotalCost($scope.orders);
      });
    });
    $scope.newAdvertiser = {};
    $scope.addAdvertiser = false;
    $scope.editSwitchCtrl();
  };

  $scope.delLineitem = function(id){
    Advertiser.deleteLineItem(id).then(function(res){
      return Advertiser.getAdvertiser($stateParams.id).then(function(Advertiser){
        $scope.Advertiser.orders = Advertiser.orders;
      });
    });
  };

  $scope.advertiserEditSwitch = function() {
    $scope.advertiserEdit = !$scope.advertiserEdit;
  };

  $scope.editSwitchCtrl = function(order) {
    if(!order){
      $scope.editAdvertiserId = null;
    }else{
      $scope.editAdvertiserId = order.id;
    }
  };

  $scope.getTotalCost = function(orders){
    var cost = 0;
    angular.forEach(orders, function(order,idx){
      cost += parseFloat(order.cost);
    });
    $scope.totalCost = cost;
  };

  $scope.getTotalCost($scope.orders);
}]);