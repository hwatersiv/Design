  var ruleEnumValuesModule= angular.module('marketplace.ruleenumvalues',[
      'marketplace.entities'
      ]);

  ruleEnumValuesModule.controller('RuleEnumValuesCtrl', function ($scope, RuleEnumValue, Notification, $state) {
      $scope.$state = $state;
      $scope.Notification = Notification;
      $scope.RuleEnumValue = RuleEnumValue;
      RuleEnumValue.getRuleEnumValues();
  });