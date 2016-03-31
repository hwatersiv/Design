var templateVariablesModule = angular.module('marketplace.templatevariables');
  templateVariablesModule.controller('TemplateVariablesCreateCtrl', function ($scope, TemplateVariable, Notification, Publisher, CreativeZone, $state, $stateParams) {

  $scope.templateVariable = {
    id: null,
    name: ""
  };

  $scope.clear = function (){
    $scope.templateVariable = {
        enabled: true
    };
    $scope.errorMessage = null;
  };
    // for the create page open in edit mode
  $scope.saveNewTemplateVariable = function(templateVariable){
    templateVariable.enabled = true;
    templateVariable.versionNumber = Date.now();
    TemplateVariable.save(templateVariable).then(function(res){
      Notification.addNotification("You have successfully created TemplateVariable " + "'" + res.name + "'", "success")
      $state.go("TemplateVariablesUIRoot.single.info", {id: res.id});
    });
  };
    $scope.CreativeZone = CreativeZone;
    $scope.Publisher = Publisher;
    $scope.TemplateVariable = TemplateVariable;

    CreativeZone.getAllCreativeZones();
    TemplateVariable.getTemplateVariables();
    TemplateVariable.getTemplateVariableTypes();
    Publisher.getPublishers();
});