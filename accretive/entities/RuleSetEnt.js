var entitiesModule = angular.module('marketplace.entities');

entitiesModule.factory('RuleSetEnt',
  function(AppConstants, $http) {

    var RuleSetEnt = {};

    RuleSetEnt.rulesets = [];


    RuleSetEnt.getRuleSets = function(){
      var url = AppConstants.apiBaseURL + "rulesets";

      return $http.get(url).then(function (res){
        RuleSetEnt.rulesets = res.data;
        return RuleSetEnt.rulesets;
      });
    };

    RuleSetEnt.getRuleSet = function(id){
        var url = AppConstants.apiBaseURL + "rulesets/"+id;

        return $http.get(url).then(function (res){
           RuleSetEnt.ruleset = res.data;
           return RuleSetEnt.ruleset;
        });
    };

    RuleSetEnt.saveNewRuleSet = function(newRuleSet){
      var url = AppConstants.apiBaseURL + "rulesets";

      return $http.post(url, newRuleSet).success(function (res) {
        return res.data;
      });
    };

    RuleSetEnt.delete = function (id) {
        var url = AppConstants.apiBaseURL + "rulesets/" + id;
        return $http.delete(url).then(
            function (res) {
                RuleSetEnt.getRuleSets();
                return res;
            },
            function (res){
            })
    };

    RuleSetEnt.enableRule = function(rule){
          rule.enabled = true;
    };


      RuleSetEnt.deleteRuleInRuleSet = function (ruleSet, rule) {
      var url = AppConstants.apiBaseURL + "rulesets/" + ruleSet.id + "/rules/" + rule.id;
      return $http.delete(url).then(
        function (res) {
          return res.data;
        },
        function (res){
        })
    };

     RuleSetEnt.getABTCookieRuleText = function(abtCookie)
      {
          if(abtCookie == null || typeof(abtCookie) == "undefined")
              return ",,,,,,,,";

          var rule = (typeof(abtCookie.ageInDays) != "undefined" && abtCookie.ageInDays != null)? abtCookie.ageInDays : "";
          rule += ",";

          if(abtCookie.publishers instanceof Array)
          {
              rule += abtCookie.publishers.join("#");
          }
          rule += ",";

          if(abtCookie.campaigns instanceof Array)
          {
              rule += abtCookie.campaigns.join("#");
          }
          rule += ",";

          if(abtCookie.cz instanceof Array)
          {
              rule += abtCookie.cz.join("#");
          }
          rule += ",";

          if(abtCookie.creatives instanceof Array)
          {
              rule += abtCookie.creatives.join("#");
          }
          rule += ",";

          rule +=
              (typeof(abtCookie.viewLessThan) != "undefined" && abtCookie.viewLessThan != null)?
                  abtCookie.viewLessThan : "";
          rule += ",";

          rule +=
              (typeof(abtCookie.viewGreaterThan) != "undefined" && abtCookie.viewGreaterThan != null)?
                  abtCookie.viewGreaterThan : "";
          rule += ",";

          rule +=
              (typeof(abtCookie.clicksLessThan) != "undefined" && abtCookie.clicksLessThan != null)?
                  abtCookie.clicksLessThan : "";
          rule += ",";

          rule +=
              (typeof(abtCookie.clicksGreaterThan) != "undefined" && abtCookie.clicksGreaterThan != null)?
                  abtCookie.clicksGreaterThan : "";

          return rule;
      };

      // See getABTCookieRuleText
      RuleSetEnt.parseABTCookieRule = function(ruleText)
      {
          // rule values are always stored as JSON array (this is the way the
          // ad router expect it to be) therefore we have to extract the first value
          if(ruleText instanceof Array)
          {
              ruleText = ruleText[0];
          }

          var components = (
          typeof(ruleText) != "undefined" && ruleText != null && !(ruleText instanceof Array))?
              ruleText.split(",") : null;

          if(components instanceof Array)
          {
              return {
                  "ageInDays"         : components[0],
                  "publishers"        : components[1].split("#"),
                  "campaigns"         : components[2].split("#"),
                  "cz"                : components[3].split("#"),
                  "creatives"         : components[4].split("#"),
                  "viewLessThan"      : components[5],
                  "viewGreaterThan"   : components[6],
                  "clicksLessThan"    : components[7],
                  "clicksGreaterThan" : components[8]
              };
          }
          else
          {
              return {
                  "ageInDays"         : "",
                  "publishers"        : new Array(),
                  "campaigns"         : new Array(),
                  "cz"                : new Array(),
                  "creatives"         : new Array(),
                  "viewLessThan"      : null,
                  "viewGreaterThan"   : null,
                  "clicksLessThan"    : null,
                  "clicksGreaterThan" : null
              };
          }
      };

      return RuleSetEnt;
});