module.exports = app.directive('sanFieldGroup', function (){

  return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'src/app/directives/san-field-group/san-field-group.tpl.html'
  };

});

module.exports = app.directive('sanField', function (){

  return {
    restrict: 'E',
    scope: {
      label: "@",
      editVar: "=?",
      type: "@?",
      model: "=",
      required: "=?"
    },
    transclude: true,
    templateUrl: 'src/app/directives/san-field-group/san-field.tpl.html',
    link: function ($scope, element, attrs) {
      //attempts to resolve the Date error
      // $scope.makeDate = function (type) {
      //   if($scope.type == 'date') {
      //     console.log(Date($scope.model));
      //     $scope.model = Date($scope.model);
      //   }
      // };

    }
  };

});