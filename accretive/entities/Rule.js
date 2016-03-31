var entitiesModule = angular.module('marketplace.entities');

entitiesModule.factory('Rule',
  function(AppConstants, $http) {

    var Rule = {};

    Rule.ruleOptions = [];
    Rule.optionValues = [];

    Rule.types = {
      COUNTRY: 1,
      LANGUAGE: 2,
      PLATFORM: 3,
      AD_TYPE: 4,
      AD_DIMENSION: 5,
      PUBLISHER: 6,
      CREATIVE_ZONE: 9,
      AD_LOCATION: 10,
      ABT_COOKIE: 11,
      SUB_AD_TYPE: 12,
      URL_QUERY_PARAM: 13
    };

    Rule.getRuleValues = function () {
      var url = AppConstants.apiBaseURL + "entities_template/Rule";

      return $http.get(url).success(function (res){

        var displayStringMapper = function(obj){
          obj.displayName = obj.enumDisplayString || obj.typeName || obj.name || obj.location;
          return obj;
        };

        Rule.optionValues[Rule.types.COUNTRY] = _.map(res.options.country, displayStringMapper);
        Rule.optionValues[Rule.types.LANGUAGE] = _.map(res.options.language, displayStringMapper);
        Rule.optionValues[Rule.types.PLATFORM] = _.map(res.options.deviceType, displayStringMapper);
        Rule.optionValues[Rule.types.AD_TYPE] = _.map(res.options.creativeZoneType_id, displayStringMapper);
        Rule.optionValues[Rule.types.PUBLISHER] = _.map(res.options.publisherId, displayStringMapper);
        Rule.optionValues[Rule.types.CREATIVE_ZONE] = _.map(res.options.creativeZones, displayStringMapper);
        Rule.optionValues[Rule.types.AD_LOCATION] = _.map(res.options.location, displayStringMapper);

        return res;
      });
    };

    Rule.getRuleOptions = function() {
      var url = AppConstants.apiBaseURL + "entities_template/Rule";

      return $http.get(url).success(function (res){
          Rule.ruleOptions = _(res.options.typeId)
            .filter(function (i) {
              return i.typeDisplayName;
            }).value();
        return Rule.ruleOptions;
      });
    };

    Rule.getAllOptions = function() {
        var url = AppConstants.apiBaseURL + "entities_template/Rule";

        return $http.get(url).success(function (res){
            Rule.options = res.options;
            return Rule.options;
        });
    };

    return Rule;

});