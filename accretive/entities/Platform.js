var entitiesModule = angular.module('marketplace.entities');

entitiesModule.factory('Platform',
  function(AppConstants, $http) {

    var Platform = {};

    Platform.platforms = [];

    Platform.getAllPlatforms = function() {
      var url = AppConstants.apiBaseURL + "platforms";

      return $http.get(url).then(function (res){
        Platform.platforms = res.data;
        
        return Platform.platforms;
      })
    };

    return Platform;

});