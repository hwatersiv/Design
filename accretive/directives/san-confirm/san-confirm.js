
module.exports = app.directive('sanConfirm', function(){

  return {
    restrict: 'E',
    transclude: true,
    scope: {
      active: '=',
      confirm: '&',
      "confirmText": '@',
      cancel: '&',
      "cancelText": '@'
    },
    templateUrl: 'src/app/directives/san-confirm/san-confirm.tpl.html'
  };

});
