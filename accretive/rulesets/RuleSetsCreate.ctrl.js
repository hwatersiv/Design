var rulesetsModule = angular.module('marketplace.rulesets');
  rulesetsModule.controller('RuleSetsCreateCtrl', function ($scope, RuleSetEnt, Inventory, Notification, $state, Rule) {
    $scope.RuleSet = RuleSetEnt;
    $scope.Rule = Rule;
    $scope.Inventory = Inventory;
    Rule.getRuleOptions();
    Rule.getRuleValues();

    $scope.options = Rule.ruleOptions;
    $scope.values = Rule.optionValues;

    $scope.ruleset = {
    id: null,
    name: ""
  };

  $scope.clear = function (){
    $scope.ruleset = {
      enabled: true
    };
  };
  // for the create page open in edit mode
  $scope.saveNewRuleSet = function(ruleset){
    ruleset.versionNumber = Date.now();
    RuleSetEnt.saveNewRuleSet(ruleset).then(function(res){
      Notification.addNotification("You have successfully created RuleSet " + "'" + res.data.name + "'", "success");
      $state.go("RuleSetUIRoot.single.info", {id: res.data.id});
    });
  };

  });