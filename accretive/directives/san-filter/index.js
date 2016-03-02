app.directive('sanFilter', function(){
  return {
    restrict: 'E',
    scope: {
      filter: '='
    },
    templateUrl: 'src/app/directives/san-filter/san-filter.tpl.html',
    controller: function($scope, $filter) {
      $scope.settings = {};
      $scope.filter = function(i) {
        return (($scope.settings.showDisabled ? true : (i.enabled && i.enabled !== "0")) &&
          ($filter('filter')([i], $scope.searchFilter).length > 0));
      }
    }
  }
});
