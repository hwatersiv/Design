var entitiesModule = angular.module('marketplace.entities');

entitiesModule.factory('RuleEnumValue',
    function(Notification, AppConstants, $http, $q) {
      var RuleEnumValue = {};
      RuleEnumValue.RuleEnumValues = [];

      function format(enumvalue) {
        var converted = angular.copy(enumvalue);
        converted.typeId = parseInt(converted.id);
        converted.startDate = new Date(enumvalue.startDate * 1000);
        converted.endDate = new Date(enumvalue.endDate * 1000);
        converted.versionNumber = new Date(enumvalue.versionNumber * 1000);
        converted.createDate = new Date(enumvalue.createDate * 1000);
        converted.enabled = (enumvalue.enabled !== '0' && enumvalue.enabled !== false);
        return converted;
      }

      RuleEnumValue.getRuleEnumValues = function(){
        url = AppConstants.apiBaseURL + 'enumvalues/';
        return $http.get(url).then(function(res){
          angular.forEach(res.data, function(key, value){
            key.id = key.enumValue;
            key.name = key.typeName+" - "+key.enumDisplayString;
          });
          RuleEnumValue.RuleEnumValues = res.data;
          return RuleEnumValue.RuleEnumValues;
        });
      };

      RuleEnumValue.getRuleEnumValue = function(input){
        url = AppConstants.apiBaseURL + 'enumvalues/'+input.typeName+'/'+input.enumDisplayString;
          //todo fix to receive single object
        return $http.get(url).then(function(res){
          return res.data[0];
        });
      };

      RuleEnumValue.getRuleEnumTypes = function(){
          url = AppConstants.apiBaseURL + 'entities_template/RulesEnumValues';
          return $http.get(url).then(function(res){
              angular.forEach(res.data.options.typeId,function(key,value){
                    if(key.typeDisplayName == null){
                        key.typeDisplayName = key.typeName;
                    }
              });
              RuleEnumValue.ruleEnumTypes = res.data.options.typeId;
              return RuleEnumValue.ruleEnumTypes;
          });
      };

      RuleEnumValue.delete = function(id) {
        var url = AppConstants.apiBaseURL + 'enumvalues/'+ id;
        return $http.delete(url).then(function(res){
          // update cached list of RuleEnumValues
          RuleEnumValue.RuleEnumValues = _.filter(RuleEnumValue.RuleEnumValues, function(i) { return i.typeId != id });
          return res.data;
        });
      };

      RuleEnumValue.save = function(enumvalue) {
        var url = AppConstants.apiBaseURL + 'enumvalues';
        return $http.post(url, enumvalue).then(function (res){
              // update cached list of RuleEnumValues
              RuleEnumValue.RuleEnumValues = _.filter(RuleEnumValue.RuleEnumValues, function(i) { return i.typeId != res.data.typeId });
              RuleEnumValue.RuleEnumValues.push(res.data);
              RuleEnumValue.getRuleEnumValues();
              return res.data;
        },
            function (res) {
                Notification.addHTTP(res);
                return $q.reject(res.data);
            });
      };

      return RuleEnumValue;
    });