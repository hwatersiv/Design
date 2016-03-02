var ruleEnumValuesModule = angular.module('marketplace.ruleenumvalues');
  ruleEnumValuesModule.controller('RuleEnumValuesCreateCtrl', function ($scope, RuleEnumValue, Notification, $state, $stateParams) {

  $scope.ruleEnumValue = {
    id: null,
    name: ""
  };

  $scope.clear = function (){
    $scope.templateVariable = {
      enabled: true
    };
  };
    // for the create page open in edit mode
  $scope.saveNewRuleEnumValue = function(ruleEnumValue){
    ruleEnumValue.enabled = true;
    ruleEnumValue.versionNumber = Date.now();
    RuleEnumValue.save(ruleEnumValue).then(function(res){
      Notification.addNotification("You have successfully created RuleEnumValue " + "'" + res.enumDisplayString + "'", "success");
      $state.go("RuleEnumValueUIRoot.single.info", {typeName:res.typeName,enumDisplayString: res.enumDisplayString});
    });
  };
  RuleEnumValue.getRuleEnumTypes();
});