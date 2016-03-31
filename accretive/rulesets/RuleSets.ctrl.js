  var rulesetsModule= angular.module('marketplace.rulesets',[
      'marketplace.entities'
      ]);

  rulesetsModule.controller('RuleSetsCtrl', function ($scope, RuleSetEnt, Notification, $state, $location, $anchorScroll, $stateParams) {
      $scope.$state = $state;
      $scope.ruleSetCreate = false;
      $scope.Notification = Notification;
      $scope.RuleSet = RuleSetEnt;
      $scope.button = "New Rule";
      RuleSetEnt.getRuleSets();
      $scope.gotoSidebar = function() {
          $location.hash('topInfo');
          $anchorScroll();
      };

      $scope.rulesetCreateSwitch = function() {
          $scope.id = $stateParams.id;
          if($scope.button == "New Rule"){
              $scope.button = "Cancel New Rule";
          }else{
              $scope.button = "New Rule";
          }
          $scope.rulesetEdit = !$scope.rulesetEdit;
          $scope.ruleSetCreate = !$scope.ruleSetCreate;
      };


  });