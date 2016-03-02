  var ruleEnumValuesModule = angular.module('marketplace.ruleenumvalues');
  ruleEnumValuesModule.controller('RuleEnumValueCtrl', function ($scope, RuleEnumValue, $stateParams) {
  $scope.RuleEnumValue = RuleEnumValue;
  // if we viewing an existing RuleEnumValue load it from the APIR
  $scope.tabs = [
    { title: "RuleEnumValue Info", route:"RuleEnumValueUIRoot.single.info", active:true }
  ];
});