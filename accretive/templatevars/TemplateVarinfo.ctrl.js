var templateVariablesModule = angular.module('marketplace.templatevariables');

templateVariablesModule.controller('TemplateVariableInfoCtrl', function ($scope, TemplateVariable, CreativeZone, Publisher, Platform, $state, $stateParams) {

  $scope.TemplateVariable = TemplateVariable;
  $scope.newTemplate = {};
  $scope.templateVariableEdit = false;
  $scope.deleteAlert = false;
  $scope.delConfirmLineItem = false;
  $scope.editTemplateId = null;
  $scope.addTemplate = false;
  $scope.Publisher = Publisher;
  $scope.CreativeZone = CreativeZone;
  /////////////////////////
  //// TemplateVariable methods
  /////////////////////////
  $scope.save = function(templateVariable) {
    TemplateVariable.save(templateVariable).then(
      function(res) {
        $scope.templateVariable = templateVariable;
        $scope.templateVariableEditSwitch();
      },
      function(res) {
        Notification.addNotification('Problem saving Template Variables.','error');
      });
  };
  $scope.deleteTemplateVariable = function(id){
    TemplateVariable.delete(id).then(function(res){
      $state.go('TemplateVariablesUIRoot.index', {msg: res});
    })
  };
  /////////////////////////
  //// Line Item methods
  /////////////////////////
  $scope.saveLineItem = function(order){
    $scope.newTemplate = {};
    $scope.addTemplate = false;
    $scope.editSwitchCtrl();
  };
  $scope.templateVariableEditSwitch = function() {
    $scope.templateVariable.creativeZoneId = $scope.templateVariable.creativeZonesList;
    $scope.templateVariable.publisherId = $scope.templateVariable.publishersList;
    $scope.templateVariableEdit = !$scope.templateVariableEdit;
  };
  $scope.editSwitchCtrl = function(order) {
    if(!order){
      $scope.editTemplateId = null;
    }else{
      $scope.editTemplateId = order.id;
    }
  };
  TemplateVariable.getTemplateVariableTypes();
  TemplateVariable.getTemplateVars();
  Publisher.getPublishers();
  CreativeZone.getAllCreativeZones();
});