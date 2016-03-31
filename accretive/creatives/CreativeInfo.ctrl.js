var creativesModule = angular.module('marketplace.creatives');

creativesModule.controller('CreativeInfoCtrl', function ($scope, Creative, Platform, $state, Notification, $stateParams, creative) {

  $scope.Creative = Creative;
  $scope.newTemplate = {};
  $scope.creativeEdit = false;
  $scope.deleteAlert = false;
  $scope.delConfirmLineItem = false;
  $scope.creativeId = null;
  $scope.addCreative = false;
  $scope.creative = creative;
  Creative.getCreativeTypes();
  /////////////////////////
  //// Creative methods
  /////////////////////////
  $scope.save = function(creative) {
    Creative.save(creative).then(
      function(res) {
        $scope.creative = res;
        $scope.creativeEditSwitch();
      },
      function(res) {
        Notification.addNotification('Problem saving Creative.','error');
      });
  };
  $scope.deleteCreative = function(id){
    Creative.delete(id).then(function(res){
      $state.go('CreativeUIRoot.index', {msg: res});
    })
  };
  $scope.creativeEditSwitch = function() {
    $scope.creativeEdit = !$scope.creativeEdit;
  };
  /////////////////////////
  //// Line Item methods
  /////////////////////////
  $scope.editSwitchCtrl = function(order) {
    if(!order){
      $scope.creativeId = null;
    }else{
      $scope.creativeId = order.id;
    }
  };
});