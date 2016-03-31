  var templateVariablesModule = angular.module('marketplace.templatevariables');

  templateVariablesModule.controller('TemplateVariableCtrl', function ($scope, TemplateVariable, $stateParams, templateVariable) {
    $scope.TemplateVariable = TemplateVariable;
    // if we viewing an existing TemplateVariable load it from the APIR
    if ($stateParams.id) {
      $scope.templateVariable = templateVariable;
    }
    $scope.tabs = [
      { title: "TemplateVariable Info", route:"TemplateVariablesUIRoot.single.info",     active:true }
    ];
  });