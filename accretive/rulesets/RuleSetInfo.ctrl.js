var rulesetsModule = angular.module('marketplace.rulesets');

rulesetsModule.controller('RuleSetInfoCtrl', function ($scope, RuleSetEnt, Rule, Platform, $state, Notification, $stateParams, ruleset) {

  $scope.RuleSet = RuleSetEnt;
  $scope.Rule = Rule;
  $scope.rulesetEdit = false;
  $scope.ruleSetCreate = false;
  $scope.deleteAlert = false;
  $scope.delConfirmLineItem = false;
  $scope.rulesetId = null;
  $scope.addRuleSet = false;
  $scope.ruleset = ruleset;
  Rule.getRuleValues();
  $scope.rules = ruleset.rules;
  $scope.values = Rule.optionValues;
  Rule.getRuleOptions();
  Rule.getAllOptions();
  $scope.count = ruleset.rules.length;
  /////////////////////////
  //// RuleSet methods
  /////////////////////////
  $scope.save = function(ruleset) {
    RuleSetEnt.saveNewRuleSet(ruleset).then(
      function(res) {
        $scope.ruleset = res.data;
        $scope.rulesetEditSwitch();
      },
      function(res) {
         Notification.addNotification('Problem saving RuleSet: '+res.data.error);
      });
  };

  $scope.DeleteRule = function(row){
    RuleSetEnt.deleteRuleInRuleSet($scope.ruleset,$scope.ruleset.rules[row]).then(function(res){
      $scope.ruleset = res;
    });
  };

  $scope.enableRule = function(row){
    $scope.ruleset.rules[row].enabled = true;
  };

  $scope.deleteRuleSet = function(id){
    RuleSetEnt.delete(id).then(function(res){
      $state.go('RuleSetUIRoot.index', {msg: res});
    })
  };


  $scope.rulesetEditSwitch = function() {
    $scope.rulesetEdit = !$scope.rulesetEdit;
  };
  /////////////////////////
  //// Line Item methods
  /////////////////////////
  $scope.editSwitchCtrl = function(order) {
    if(!order){
      $scope.rulesetId = null;
    }else{
      $scope.rulesetId = order.id;
    }
  };
  $scope.rulesetCreateSwitch = function() {
    $scope.ruleSetCreate = !$scope.ruleSetCreate;
    $scope.rulesetEdit = false;
  };
});