var publishersModule = angular.module('marketplace.publishers');

publishersModule.controller('PublisherCreateCtrl', 
  function ($scope, Publisher, Notification, $state) {

  $scope.newPublisher = {
    enabled: true
  };

  $scope.clear = function (){
    $scope.newPublisher = {
      enabled: true
    };
    $scope.errorMessage = null;
  };

  $scope.save = function (newPublisher) {
    var onError = function (response) {
      $scope.errorMessage = response.data;
    };
    var onSuccess = function(response){
      Notification.addNotification("You have successfully created Publisher" + "'" + response.name + "'", "success")
      //
      // Route the User to go to the publisher base page
      //
      $state.go("PublishersUIRoot.single.info",{id:response.id});
    };
    Publisher.save(newPublisher).then(onSuccess,onError);
  };
});