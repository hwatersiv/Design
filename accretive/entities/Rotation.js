var entitiesModule = angular.module('marketplace.entities');

entitiesModule.factory('Rotation',
  function(AppConstants, $http) {

    var Rotation = {};

    Rotation.rotations = [];

    Rotation.types = {
      POPUNDER: 4,
      IFRAME: 1,
      NAVILINK: 7,
      IMAD: 2
    };

    Rotation.getStringForType = function (typeId) {
      return {
        4: "Popunder",
        1: "IFrame",
        7: "Navi Link",
        2: "IM Ad"
      }[typeId];
    };
    
    Rotation.getAllRotations = function () {
      var url = AppConstants.apiBaseURL + "rotations";

      return $http.get(url).then(function (res) {
        Rotation.rotations = res.data;
        return Rotation.rotations;
      });
    };

    Rotation.getRotation = function (id){
      var url = AppConstants.apiBaseURL + "rotations/" + id;

      return $http.get(url).success(function (res) {
        res.isHeterogeneous == 0 || null? false : true;


        return res;
      })
    };

    Rotation.saveNewRotation = function (rotation){
      if(rotation.creativeZoneType_id == Rotation.types.IMAD){
        rotation.isHeterogeneous = 1;
      };
      rotation.typeName = Rotation.getStringForType(rotation.creativeZoneType_id);
      rotation.isHeterogeneous == true? 1 : 0;
      var url = AppConstants.apiBaseURL + "rotations";

      if(rotation.id){
        var url = AppConstants.apiBaseURL + "rotations/" + rotation.id;
      };

      return $http.post(url, rotation).success(function (res) {
        return res;
      });
    };

    Rotation.saveCreativeToRotation = function (creative, rotationId) {
      var url = AppConstants.apiBaseURL + "rotations/" + rotationId + "/creatives/" + creative.id

      return $http.post(url, creative).success(function (res) {
        return res;
      });
    };

    Rotation.unlinkCreative = function (creative, rotationId) {
      var url = AppConstants.apiBaseURL + "rotations/" + rotationId + "/creatives/" + creative.id;

      return $http.delete(url).success(function (res) {
        return res;
      });
    };

    Rotation.deleteRotation = function (rotationId) {
      var url = AppConstants.apiBaseURL + "rotations/" + rotationId;

      return $http.delete(url).then(
        function (res){
          return res.data;
        },
        function (res){
          Notification.addHTTP(res);
          return $q.reject(res.data);
      });
    };

    return Rotation;

});