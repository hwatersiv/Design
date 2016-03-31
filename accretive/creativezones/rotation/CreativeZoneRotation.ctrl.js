var creativeZonesModule = angular.module('marketplace.creativezones');

creativeZonesModule.controller('CreativeZoneRotationCtrl',
  function ($scope, Publisher, CreativeZone, Rotation, RuleSetEnt, Rule, $state, $stateParams, AppConstants, creativeZone) {

  $scope.RuleSet = RuleSetEnt;
  $scope.CreativeZone = CreativeZone;
  $scope.Rule = Rule;
  $scope.Rotation = Rotation;
  $scope.dRotation = creativeZone.defaultRotation; //this creativeZone is called in the routes resolve function
  $scope.cz = creativeZone; //this creativeZone is called in the routes resolve function
  $scope.newRotation = null;
  $scope.newRuleSet = null;
  $scope.newRule = {
    isNegation: false,
    enabled: true
  };
  $scope.ruleSetDetails = false;
  $scope.newRuleSetRotation = false;
  $scope.existingRuleSet = false;
  $scope.createNewRule = false;
  $scope.removeRuleAlert = null;
  $scope.editRule = null;



  $scope.getRuleValues = function(typeId){
    if(!typeId){
      return null;
    }
    console.log(Rule.optionValues[typeId]);
    return Rule.optionValues[typeId];
  };

  $scope.saveNewRotation = function(rotation){
    var onSuccess = function (response) {
      $scope.newRotation = response.data;
    };
    var onError = function(response) {
    };
    var obj = {
      "name": rotation,
      "typeId": $scope.cz.typeId,
      "creativeZoneId": $scope.cz.id
    };
    Rotation.saveNewRotation(obj).then(onSuccess, onError);
  };

  $scope.saveNewRuleSet = function(ruleset, rotation){
    var onSuccess = function (response) {
      $scope.newRuleSet = response.data;
    };
    var onError = function(response) {
      console.log("error", response.plain());
    };

    var obj = {
      "name": ruleset,
      "rules": [],
      "rotationId": rotation.id
    };

    RuleSetEnt.saveNewRuleSet(obj).then(onSuccess, onError);
  };

  $scope.addRuleSetToCZ = function() {
    CreativeZone.addRuleSet($stateParams.czid, $scope.newRuleSet.id, $scope.newRotation.id).then(function(response){
      $scope.cz = response.data;
      Rotation.getRotation($scope.cz.defaultRotationId).then(function(response){
        $scope.dRotation = response.data;
      })
    });
    $scope.cancelNewRuleSetRotation();
  };

  $scope.prepNewRule = function(newRule){
    var rule = _.merge({}, newRule);

    if(!rule.id){
      rule.enabled = true;
      rule.ruleSetId = $scope.newRuleSet.id;

      for(var i = 0; i < Rule.ruleOptions.length; i++){
        if(parseInt(rule.typeId) == parseInt(Rule.ruleOptions[i].typeId)) {
          rule.typeName = Rule.ruleOptions[i].typeName;
        }
      }
    }else{
      // removes the old rule with the same id and replaces it with the edited rule
      for(var i = 0; i < $scope.newRuleSet.rules.length; i++){
        if(rule.$$hashKey == $scope.newRuleSet.rules[i].$$hashKey){
          $scope.newRuleSet.rules.splice(i, 1);
        }
      }
    }

    $scope.newRuleSet.rules.push(rule);
    $scope.cancelCreateNewRule();
    $scope.editRuleSwitch();
    RuleSetEnt.saveNewRuleSet($scope.newRuleSet).then(function(response){
      $scope.newRuleSet = response.data; 
    });
  };

  $scope.deleteRule = function(rule){
    $scope.cancelRemoveRuleSwitch();
    for(var i = 0; i < $scope.newRuleSet.rules.length; i++){
      if(rule.typeId == $scope.newRuleSet.rules[i].typeId){
        $scope.newRuleSet.rules.splice(i, 1);
      }
    };
    RuleSetEnt.deleteRuleInRuleSet($scope.newRuleSet, rule).then(function (res) {
      console.log(res);
      $scope.newRuleSet = res; 
    });
  };

  $scope.filteredRuleOpt = function (newRuleSet) {
    if(!newRuleSet){
      return
    }else{
      var typeids = _.map(newRuleSet.rules, function(i){
         return i.typeId;
      });
      return _.filter(Rule.ruleOptions, function(i){
        return typeids.indexOf(i.typeId) === -1;
      });
    }
  };

  $scope.updateRuleSet = function(ruleSet){
    RuleSetEnt.updateRuleSet(ruleSet, $stateParams.czid);
  };

  $scope.createCreativeLinkUrl = function(contentPath, typeId){
    var baseUrl = AppConstants.adserverDebugURLPrefix + "/if?creContentPath=";

    return baseUrl + escape(contentPath) + "&creTypeId=" + escape(typeId);
  };

////////////////////
// Switches    /////
////////////////////

  $scope.cancelNewRuleSetRotation = function(){
    $scope.newRuleSetRotation = !$scope.newRuleSetRotation;
    $scope.newRotation = null;
    $scope.newRuleSet = null;
    $scope.newRule = {
      isNegation: false,
      enabled: true
    };
  }

  $scope.cancelCreateNewRule = function(){
    $scope.createNewRule = false;
  };

  $scope.createNewRuleSwitch = function(newRuleSet){
    $scope.createNewRule = !$scope.createNewRule;
    if(!newRuleSet){
      return
    }else{
      $scope.filteredRuleOpt(newRuleSet);
    }
  };

  $scope.removeRuleSwitch = function(id){
    $scope.removeRuleAlert = id;
  };

  $scope.cancelRemoveRuleSwitch = function(){
    $scope.removeRuleAlert = null;
  };

  $scope.editRuleSwitch = function(id, rule) {
    $scope.eRule = rule;
    if(id == null){
      $scope.editRule = null;
    }
    else{
      $scope.editRule = id;
    }
  };

  $scope.cancelEditRuleSwitch = function() {
    $scope.eRule = {};
    $scope.editRule = null;
  };

  RuleSetEnt.getRuleSets();
  Rotation.getAllRotations();
  Rule.getRuleOptions();
  Rule.getRuleValues();
});
