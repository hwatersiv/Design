var publishersModule = angular.module('marketplace.publishers');

publishersModule.controller('PublisherInfoCtrl', 
  function ($scope, Publisher, Notification, TemplateVariable, $state, $stateParams) {

    $scope.pubEdit = false;
    $scope.tempVarEdit = null;
    $scope.newTempVarSwitch = false;
    $scope.deleteAlert = false;
    $scope.pubTempVars = [];
    $scope.errorMessage = null;
    $scope.tempVarConfirmDelete = false;
    $scope.deletingTempVar = null;
    $scope.tempVarTypes = [];
    $scope.newTempVar = {publisherId: $stateParams.id, enabled: true};
    /////////////////////////
    //Publisher Functions
    /////////////////////////

    $scope.getPublisher = function(id){
      Publisher.getPublisher(id).then(function(res){
        $scope.pub =  res;
      });
    };

    $scope.deletePublisher = function (id){
      var success = function (response){
        Notification.addNotification(response.data, 'success');
        //
        // ask the parent controller to refresh the publishers on the sidebar
        //
        $state.go("PublishersUIRoot.index");
      };
      Publisher.delete(id).then(success);
    };

    $scope.save = function (editPub){
      var onSuccess = function(response){
        response.createDate = new Date(parseInt(response.createDate, 10));
        response.versionNumber = new Date(parseInt(response.versionNumber, 10));
        $scope.pub = response;

      };
      Publisher.save(editPub).then(onSuccess);
      $scope.pubEdit =! $scope.pubEdit;
    };
    /////////////////////////
    //Template Variable Functions
    /////////////////////////
    $scope.getPubTempVars = function(id){
      Publisher.getTemplateVariables(id).then(function (res) {
        $scope.pubTempVars = res;
      });
    };

    $scope.savePubTempVar = function(tempVar){
      var onSuccess = function(response){
        $scope.getPubTempVars($stateParams.id);
        $scope.newTempVarSwitch = false;
        $scope.cancelTempVarEdit();
      };
      TemplateVariable.save(tempVar).then(onSuccess);
    };

    $scope.getTempVarTypes = function(){
      TemplateVariable.getTemplateTypes().then(function (res) {
        filteredTempVarTypes($scope.pubTempVars);
      });
    };

    $scope.deletePubTempVar = function(id){
      var onSuccess = function (response){
        $scope.tempVarConfirmDelete = false;
        $scope.getPubTempVars($stateParams.id);
      };
      TemplateVariable.delete(id).then(onSuccess);
    };

    var filteredTempVarTypes = function(pubTempVars){
      $scope.filteredTypes = [];
      var types = TemplateVariable.templateTypes;

      if(pubTempVars.length > 0) {
        for(var i = 0; i<pubTempVars.length; i++){
          for (var j = 0; j< TemplateVariable.templateTypes.length; j++){
            if(pubTempVars[i].typeName == types[j].name){
              types.splice(j,1);
            }
          }
          $scope.filteredTypes = types;
        }
      }
      else{
        $scope.filteredTypes = types;
      }
    };
    /////////////////////////
    //Switch functions
    /////////////////////////
    $scope.pubEditSwitch = function () {
      $scope.pubEdit=!$scope.pubEdit;
    };

    $scope.tempVarEditSwitch = function(tmpVar){
      $scope.tempVarEdit = tmpVar.id;
      $scope.editTempVar = tmpVar;
    };

    $scope.newTempVarSwitchCtrl = function(){
      $scope.newTempVar = {publisherId: $stateParams.id, enabled: true};
      filteredTempVarTypes($scope.pubTempVars);
      $scope.newTempVarSwitch = !$scope.newTempVarSwitch;
    };

    $scope.tempVarConfirmDeleteSwitch = function (tempVar) {
      $scope.deletingTempVar = tempVar;
      $scope.tempVarConfirmDelete = !$scope.tempVarConfirmDelete;
    };

    $scope.cancelTempVarEdit = function(){
      $scope.editTempVar = {};
      $scope.tempVarEdit = null;
    };

    $scope.getPubTempVars($stateParams.id);
    $scope.getTempVarTypes();
});