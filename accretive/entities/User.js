var entitiesModule = angular.module('marketplace.entities');

entitiesModule.factory('User', 
  function(AppConstants, $http) {

    var User = {};

    return User;
});