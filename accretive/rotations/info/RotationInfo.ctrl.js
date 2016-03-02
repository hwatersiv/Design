var rotationsModule = angular.module('marketplace.rotations');

rotationsModule.controller('RotationInfoCtrl', 
  function ($scope, Rotation, Creative, Notification, AppConstants, $state, $stateParams, oneRotation) {

    $scope.rotation = oneRotation.data;
    $scope.Rotation = Rotation;
    $scope.Creative = Creative;
    $scope.rotEdit = false;
    $scope.deleteAlert = false;
    $scope.addCreative = false;


    $scope.save = function (rotation) {
      Rotation.saveNewRotation(rotation).then(function (res) {
        $scope.rotation = res.data;
        $scope.rotEditSwitch();
      });
    };

    $scope.deleteRotation = function (rotationId) {
      Rotation.deleteRotation(rotationId).then(function (res) {
        Notification.addNotification("You have successfully disabled Rotation " + "'" + res.name + "'", "success");
        $state.go("RotationsUIRoot.index");
      });

    };

    $scope.createCreativeLinkUrl = function(contentPath, typeId){
      var baseUrl = AppConstants.adserverDebugURLPrefix + "/if?creContentPath=";

      return baseUrl + escape(contentPath) + "&creTypeId=" + escape(typeId);
    };

    $scope.saveCreativeToRot = function (creative) {
      if(!creative.weight){
        creative.weight = 0;
      };
      Rotation.saveCreativeToRotation(creative, $stateParams.id).then(function (res) {
        $scope.rotation = res.data;
      });
      $scope.cancelLinkCreative();
    };

    $scope.unlinkCreative = function (creative) {
      Rotation.unlinkCreative(creative, $stateParams.id).then(function (res) {
        $scope.rotation = res.data;
      });
    };

    $scope.isImad = function (rotation) {
      if(rotation.creativeZoneType_id==Rotation.types.IMAD){
        $scope.rotation.isHeterogeneous = true;
      }
      else{
        $scope.rotation.isHeterogeneous = false;
      }
    };

    $scope.rotEditSwitch = function () {
      $scope.rotEdit = !$scope.rotEdit;
    };

    $scope.linkCreative = function () {
      $scope.addCreative = !$scope.addCreative;
    };

    $scope.cancelLinkCreative = function () {
      $scope.dropdown = false;
      $scope.addCreative = false;
    };

    $scope.copyLinkingCreative = function (linkingCreative) {
      $scope.linkingCreative = linkingCreative;
    };

    Creative.getCreatives()
});