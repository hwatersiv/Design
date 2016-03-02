var publishersModule = angular.module('marketplace.publishers');

publishersModule.controller('ZonesCtrl', 
  function ($scope, Publisher, CreativeZone, Rotation, $state, $stateParams) {

    $scope.allCZs = {};
    $scope.CreativeZone = CreativeZone;
    $scope.czAdTypes = [];
    $scope.czLocs = [];
    $scope.defaultRotations = [];
    $scope.newCZDetailsSwitch = true;
    $scope.editCZSwitch = null;
    $scope.czConfirmDeleteSwitch = null;
    $scope.editCZ = {};
    $scope.newCZ = {};

    $scope.getPubCZ = function(pubId){
      // create an Array for each Creative zone type
      _.forIn(CreativeZone.types, function(typeId){
        $scope.allCZs[typeId] = [];
      });
      Publisher.getCreativeZones(pubId).then(function (res){
        // separates each CZ type into corresponding arrays
        for(var i= 0; i < res.data.length; i++){
          $scope.allCZs[parseInt(res.data[i].typeId)].push(res.data[i]);
        }
      });
    };

    $scope.getCZAdTypes = function (){
      $scope.czAdTypes = CreativeZone.getTypeIds();
    };

    $scope.getDefaultRotations = function () {
      var onSuccess = function (res) {
        $scope.defaultRotations = Rotation.rotations;
      };
      Rotation.getAllRotations().then(onSuccess);
    };

    $scope.getLocations = function () {
      $scope.czLocs = CreativeZone.getLocations();
    };

    $scope.saveCZ = function(creativeZone){
      var creativeZone = angular.copy(creativeZone);

      if(creativeZone.typeId === CreativeZone.types.IFRAME){
        creativeZone.creativeZoneLocation_code = creativeZone.location.creativeZoneLocation_code;
        creativeZone.location = creativeZone.location.location;
      }
      var onSuccess = function (response) {
        $scope.newCZCancel();
        $scope.editCZSwitchCancel();
        $scope.getPubCZ($stateParams.id);
      };
      var onError = function (response) {

      };
      CreativeZone.save(creativeZone).then(onSuccess,onError);
    };

    $scope.deleteCZ = function (id) {
      var onSuccess = function (response) {
        $scope.getPubCZ($stateParams.id);
        $scope.czConfirmDeleteSwitchCancel();
      };
      var onError = function (response) {
      };
      CreativeZone.delete(id).then(onSuccess, onError);
    };

    /////////////////////////
    //Switch functions
    /////////////////////////

    $scope.newCZDetailsSwitchCtrl = function(adtype){
      $scope.newCZDetailsSwitch = false;
      $scope.newCZ.typeId = adtype;
    };

    $scope.resetNewCZ = function(){
      $scope.newCZ = {
        publisherId: $stateParams.id,
        sfw: false,
        enabled: true,
        variant: 0
      }
    };

    $scope.newCZCancel = function(){
      $scope.resetNewCZ();
      $scope.newCZDetailsSwitch = true;
      $scope.newCZSwitch = false;
    };

    $scope.editCZSwitchCtrl = function (adTypeCZ){
      $scope.editCZSwitch = adTypeCZ.id;
      $scope.editCZ = {};
      angular.copy(adTypeCZ,$scope.editCZ);
      if($scope.editCZ.width || $scope.editCZ.height !== null){
        $scope.editCZ.width = parseInt($scope.editCZ.width);
        $scope.editCZ.height = parseInt($scope.editCZ.height);
      }
    };

    $scope.editCZSwitchCancel = function () {
      $scope.editCZSwitch = null;
      $scope.editCZ = {};
    };

    $scope.czConfirmDeleteSwitchCtrl = function (id){
      $scope.czConfirmDeleteSwitch = id;
    };

    $scope.czConfirmDeleteSwitchCancel = function () {
      $scope.czConfirmDeleteSwitch = null;
    };

    $scope.getPubCZ($stateParams.id);
    $scope.getCZAdTypes();
    $scope.getDefaultRotations();
    $scope.getLocations();
    $scope.resetNewCZ();
  });
