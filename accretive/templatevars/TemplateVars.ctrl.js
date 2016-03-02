  var templateVariablesModule= angular.module('marketplace.templatevariables',[
      'marketplace.entities'
      ]);

  templateVariablesModule.controller('TemplateVariablesCtrl',  function ($scope, TemplateVariable, CreativeZone, Notification, $state) {
      $scope.$state = $state;
      $scope.TemplateVariable = TemplateVariable;
      $scope.Notification = Notification;
      TemplateVariable.getTemplateVars();
  });