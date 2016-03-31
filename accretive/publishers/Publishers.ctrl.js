var publishersModule = require('./index.js');

publishersModule.controller('PublishersCtrl',
  function ($scope, Publisher, Notification, $filter, $state, $stateParams) {

  $scope.$state = $state;
  $scope.Publisher = Publisher;
  $scope.Notification = Notification;
  $scope.parentTableMode = true;

  Publisher.getPublishers();
});
