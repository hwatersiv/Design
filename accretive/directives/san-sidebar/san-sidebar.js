
app.directive('sanSidebar', function(){

  return {
    restrict: 'E',
    scope: {
      data: '=*',
      desturl: '&'
    },
    templateUrl: 'src/app/directives/san-sidebar/san-sidebar.tpl.html',
    controller:
      function ($scope, $filter, $stateParams, $element, $transclude) {

        $scope.tableMode    = true;
        $scope.data         = []; // data for the sideBar

        // pagination initialization
        $scope.currentPage  = 1;
        $scope.itemsPerPage = 20;
        $scope.maxSize      = 5;

        $scope.isActive = function (id){
          return ($stateParams.id && id == $stateParams.id);
        };

        // pagination and filtering
        $scope.onPage = function(i, index, array) {
          $scope.totalItems = array.length;
          var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
              end = begin + $scope.itemsPerPage;

          return index >= begin && index <= end;
        };       
      }
  };
});
