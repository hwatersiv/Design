
app.directive('sanBreadcrumbs', ["$state", "$interpolate", function ($state, $interpolate) {

  return{
    restrict: 'E',
    transclude: true,
    templateUrl: 'src/app/directives/san-breadcrumbs/san-breadcrumbs.tpl.html',
    link: function ($scope) {
        $scope.crumbs = [];

        if ($state.$current.name !== '') {
          updateBreadcrumbs();
        }
        $scope.$on('$stateChangeSuccess', updateBreadcrumbs);
        
        function updateBreadcrumbs() {
          var list = [];
          var c = $state.$current;
          while (c) {
            var data = c.breadcrumb;

            if (data && data.displayName) {
              list.push({ href: $state.href(c), name: $interpolate(data.displayName)(c.locals.globals) });
            }
            c = c.parent;
          }

          $scope.crumbs = list.reverse();
        }
      }

  };

}]);



