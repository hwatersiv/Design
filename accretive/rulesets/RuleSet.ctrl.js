  var rulesetsModule = angular.module('marketplace.rulesets');
  rulesetsModule.controller('RuleSetCtrl', function ($scope, RuleSetEnt, $stateParams) {
  $scope.RuleSet = RuleSetEnt;
  // if we viewing an existing RuleSet load it from the APIR
  $scope.tabs = [
    { title: "RuleSet Info", route:"RuleSetUIRoot.single.info", active:true }
  ];
});