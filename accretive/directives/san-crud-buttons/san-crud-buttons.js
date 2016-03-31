module.exports = app.directive('sanCrudButtons', function(){

  return {
    restrict: 'E',
    scope: {
      edit: '&',
      'delete': '&',
      save: '&',
      cancel: '&'
    },
    templateUrl: 'src/app/directives/san-crud-buttons/san-crud-buttons.tpl.html'
  };

});