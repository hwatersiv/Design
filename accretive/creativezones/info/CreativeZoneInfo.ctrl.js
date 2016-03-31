var creativeZonesModule = angular.module('marketplace.creativezones');

creativeZonesModule.controller('CreativeZoneInfoCtrl', 
  function ($scope, CreativeZone, Publisher, Rotation, Notification, TemplateVariable, $state, $stateParams, creativeZone, Inventory) {

    $scope.czEdit = false;
    $scope.tempVarEdit = null;
    $scope.newTempVarSwitch = false;
    $scope.deleteAlert = false;
    $scope.czTempVars = [];
    $scope.tempVarConfirmDelete = false;
    $scope.deletingTempVar = null;
    $scope.tempVarTypes = [];
    $scope.Inventory = Inventory;
    $scope.newTempVar = {creativeZoneId: $stateParams.id, enabled: true};
    $scope.cz = creativeZone; // the creativeZone injection is from the resolve function on the routes
    $scope.Publisher = Publisher;
    $scope.Rotation = Rotation;

    /////////////////////////
    //Creative Zone Functions
    /////////////////////////

    $scope.deleteCZ = function (id){
      var success = function (response){
        Notification.addNotification(response.data, 'success');
        //
        // ask the parent controller to refresh the publishers on the sidebar
        //
        $state.go("CreativeZonesUIRoot.index");
      };
      CreativeZone.delete(id).then(success);
    };

    $scope.save = function (editCZ) {
      if(editCZ.publisher) {
        editCZ.publisherId = editCZ.publisher.id;
        editCZ.publisherName = editCZ.publisher.name;
      };

      CreativeZone.save(editCZ).then(function (response) {
        // response.createDate = new Date(parseInt(response.createDate, 10));
        // response.versionNumber = new Date(parseInt(response.versionNumber, 10));
        $scope.cz = response;
        $scope.czEdit =! $scope.czEdit;
      });     
    };


      /////////////////////////
    //Template Variable Functions
    /////////////////////////

    $scope.getCZTempVars = function(id){
      CreativeZone.getTemplateVariables(id).then(function (res) {
        $scope.czTempVars = res;
      });
    };

    $scope.saveCZTempVar = function(tempVar){
      var onSuccess = function(response){
        $scope.getCZTempVars($stateParams.id);
        $scope.newTempVarSwitch = false;
        $scope.cancelTempVarEdit();
      };
      TemplateVariable.save(tempVar).then(onSuccess);
    };

    $scope.getTempVarTypes = function(){
      TemplateVariable.getTemplateTypes().then(function (res) {
        filteredTempVarTypes($scope.czTempVars);
      });
    };

    $scope.deletePubTempVar = function(id){
      var onSuccess = function (response){
        $scope.tempVarConfirmDelete = false;
        $scope.getCZTempVars($stateParams.id);
      };
      TemplateVariable.delete(id).then(onSuccess);
    };

    var filteredTempVarTypes = function(tempVars){
      $scope.filteredTypes = [];
      var types = TemplateVariable.templateTypes;

      if(tempVars.length > 0) {
        for(var i = 0; i<tempVars.length; i++){
          for (var j = 0; j< TemplateVariable.templateTypes.length; j++){
            if(tempVars[i].typeName == types[j].name){
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


    $scope.czEditSwitch = function () {
      $scope.czEdit=!$scope.czEdit;
    };

    $scope.tempVarEditSwitch = function(index){
      $scope.tempVarEdit = index;
      $scope.editTempVar = $scope.tmpVar;
    };

    $scope.newTempVarSwitchCtrl = function(){
      $scope.newTempVar = {
        creativeZoneId: $stateParams.id,
        enabled: true
      };
      filteredTempVarTypes($scope.czTempVars);
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

    Publisher.getPublishers();
    Rotation.getAllRotations();
    CreativeZone.compileCZEmailTemplate($scope.cz);
    $scope.getCZTempVars($stateParams.id);
    $scope.getTempVarTypes();
});