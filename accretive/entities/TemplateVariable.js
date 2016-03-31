var entitiesModule = angular.module('marketplace.entities');

entitiesModule.factory('TemplateVariable',
  function(AppConstants, $http, Notification,$q) {

    var TemplateVariable = {};
    TemplateVariable.templateVariables = [];
    TemplateVariable.templateTypes = [];

    TemplateVariable.getTemplateVariables = function () {
      var url = AppConstants.apiBaseURL + 'templatevariables';
      return $http.get(url).then(function (res) {
        _.mapValues(res, function (i) {
          i.id = parseFloat(i.id);
        });
        TemplateVariable.templateVariables = res.data;
        return  TemplateVariable.templateVariables;
      });
    };

    TemplateVariable.getTemplateVars = function () {
      var url = AppConstants.apiBaseURL + 'templatevariables';
      return $http.get(url).then(function (res) {
        _.mapValues(res, function (i) {
          i.id = parseFloat(i.id);
        });
        angular.forEach(res.data, function(key, value) {
          if(key.creativeZonesList)
          {
            key.name = key.name+" in creative zone(s) "+key.creativeZonesList;
          }else{
            key.name = key.name+" Not in creative zone(s) ";
          }
        });
        TemplateVariable.templateVariables = res.data;
        return TemplateVariable.templateVariables;
      });
    };

    TemplateVariable.getTemplateVariable = function(id){
      url = AppConstants.apiBaseURL + 'templatevariables/'+id;
      return $http.get(url).then(function(res){
        return res.data;
      });
    };

    TemplateVariable.save = function(newData) {
      var url = AppConstants.apiBaseURL + 'templatevariables';

      if (newData.id) {
        url += '/' + newData.id;
      }

      return $http.post(url, newData).then(function (res) {
        // update cached list of Template Variables
        TemplateVariable.templateVariables = _.filter(TemplateVariable.templateVariables, function (i) { return i.id != res.data.id });
        TemplateVariable.templateVariables.push(res.data);
        TemplateVariable.getTemplateVars();
        return res.data;
      },
      function (res){
        Notification.addHTTP(res);
        return $q.reject(res.data);
      });
    };

    TemplateVariable.delete = function(tempVarId){
      var url = AppConstants.apiBaseURL + 'templatevariables/' + tempVarId + '?hardDelete=true';

      return $http.delete(url).then(function (res) {
        TemplateVariable.templateVariables = _.filter(TemplateVariable.templateVariables, function (i) { return i.id != tempVarId});
        return res
      });
    };

    TemplateVariable.getTemplateVariableTypes = function (){
      var url = AppConstants.apiBaseURL + 'templatevariablestypes';

      return $http.get(url).then(function (res) {
        TemplateVariable.templateTypes = res.data;
        return TemplateVariable.templateTypes;
      });
    };

    TemplateVariable.getTemplateTypes = function (){
      var url = AppConstants.apiBaseURL + 'templatevariablestypes';

      return $http.get(url).then(function (res) {
        TemplateVariable.templateTypes = res.data;

        return TemplateVariable.templateTypes;
      });
    };
    return TemplateVariable;
});