var creativesModule = angular.module('marketplace.creatives');
  creativesModule.controller('CreativesCreateCtrl', function ($scope, Creative, Notification, $state, $stateParams) {

  $scope.creative = {
    id: null,
    name: ""
  };

  $scope.clear = function (){
    $scope.creative = {
      enabled: true
    };
  };
    // for the create page open in edit mode
  $scope.saveNewCreative = function(creative){
    creative.enabled = true;
    creative.versionNumber = Date.now();
    Creative.save(creative).then(function(res){
      Notification.addNotification("You have successfully created Creative " + "'" + res.name + "'", "success");
      $state.go("CreativeUIRoot.single.info", {id:res.id});
    });
  };

  Creative.getCreativeTypes();
});