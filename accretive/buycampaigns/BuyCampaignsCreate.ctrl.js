var orderModule = angular.module('marketplace.order');

orderModule.controller('BuyCampaignsCreateCtrl', 
  function ($scope, BuyCampaign, Notification, $state, $stateParams) {

  $scope.buyCampaign = {
    id: null,
    name: ""
  };
  
  // for the create page open in edit mode
  $scope.buyOrderEdit = true;

  $scope.saveNewBuyCampaign = function(buyCampaign){   
    buyCampaign.enabled = true;
    buyCampaign.versionNumber = Date.now();
    BuyCampaign.save(buyCampaign).then(function(res){
      Notification.addNotification("You have successfully created Buy Campaign " + "'" + res.name + "'", "success")
      $state.go("BuyCampaignsUIRoot.single.info", {id: res.id});
      
    });
  };

});
