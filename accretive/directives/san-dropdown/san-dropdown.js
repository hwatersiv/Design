$scope.selectCreative = function (creative) {
      console.log(creative);
      $scope.linkingCreative = creative;
      $scope.dropdown = false;
    };

$scope.dropdownSwitch = function () {
  $scope.dropdown = true;
  $scope.linkingCreative? $scope.linkingCreative = $scope.linkingCreative.name:"";
};