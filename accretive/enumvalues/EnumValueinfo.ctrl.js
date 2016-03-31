var ruleEnumValuesModule = angular.module('marketplace.ruleenumvalues');

ruleEnumValuesModule.controller('RuleEnumValueInfoCtrl', function ($scope, RuleEnumValue, Platform, $state, Notification, $stateParams, ruleEnumValue) {

  $scope.RuleEnumValue = RuleEnumValue;
  $scope.newTemplate = {};
  $scope.ruleEnumValueEdit = false;
  $scope.deleteAlert = false;
  $scope.delConfirmLineItem = false;
  $scope.ruleEnumValueId = null;
  $scope.addRuleEnumValue = false;
  $scope.ruleEnumValue = ruleEnumValue;
  RuleEnumValue.getRuleEnumTypes();

    /////////////////////////
  //// RuleEnumValue methods
  /////////////////////////
  $scope.save = function(ruleEnumValue) {
    RuleEnumValue.save(ruleEnumValue).then(
      function(res) {
        $scope.RuleEnumValue = RuleEnumValue;
        $scope.ruleEnumValueEditSwitch();
      },
      function(res) {
        Notification.addNotification('Problem saving Rule Enum Value.','error');
      });
  };
  $scope.deleteRuleEnumValue = function(id){
    RuleEnumValue.delete(id).then(function(res){
      $state.go('RuleEnumValueUIRoot.index', {msg: res});
    })
  };
  $scope.ruleEnumValueEditSwitch = function() {
    $scope.ruleEnumValueEdit = !$scope.ruleEnumValueEdit;
  };
  /////////////////////////
  //// Line Item methods
  /////////////////////////
  $scope.editSwitchCtrl = function(order) {
    if(!order){
      $scope.ruleEnumValueId = null;
    }else{
      $scope.ruleEnumValueId = order.id;
    }
  };
});