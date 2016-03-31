var app = angular.module('app',[
      'ui.router',
      'ui.bootstrap',
      'ngSanitize',
      'ui.select',
      'ngStorage',
      'san-validators',
      'UserApp',
      'LoginApp',
      'nvd3ChartDirectives',
      'InventoryApp',
      'EntitiesAnalyticsApp',
      'AnalyticsAdminApp',
      'CustomReportApp',
      'popoverDirective',
      'savedReportService',
      require('./entities'),
      'marketplace.order',
      'marketplace.publishers',
      'marketplace.advertisers',
      'marketplace.templatevariables',
      'marketplace.creativezones',
      'marketplace.rotations',
      'marketplace.ruleenumvalues',
      'marketplace.creatives',
      'marketplace.sellcampaigns',
      'marketplace.rulesets'
  ])

.config(function(uiSelectConfig) {
    uiSelectConfig.theme = 'bootstrap';
});

app.constant('AccessLevels',{
   "guest" : 3,
   "user"  : 2,
   "admin" : 1
});

app.controller('AppCtrl',['$scope', function($scope){
  // ie fixes go here
  if (!window.location.origin) {
    window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
  }
}]);
// also export to the global scope to support legacy
// js which doesn't use `require()` yet.
global.app = app;
require('./directives/san-filter');
require('./directives/san-sidebar/san-sidebar');
require('./directives/san-breadcrumbs/san-breadcrumbs');
require('./directives/san-confirm/san-confirm');
require('./directives/san-crud-buttons/san-crud-buttons');
require('./directives/san-field-group/san-field-group');
require('./buycampaigns');
require('./advertisers');
require('./enumvalues');
require('./publishers');
require('./templatevars');
require('./creativezones');
require('./rotations');
require('./creatives');
require('./rulesets');
require('./sellcampaigns');
require('./routes');
require('./auth');
require('./header/HeaderCtrl.js');
require('./header/TypeaheadCtrl.js');
/* RuleSet stubs */
// analytics needs this exported globally for now :(
global.RuleSetStub = require('./api_stubs/ruleset_stub.js');
global.RuleSetStubConsts = RuleSetStub.CONSTANTS;
global.RuleSetStubConstToKey = RuleSetStub.CONSTANTS_REVERSE;
/* Datatables / Form handling */
require('./form-handling.js');
require('./validators.js');
/* User App */
require('./user/js/userController.js');
/* Login App */
require('./login/js/loginApp.js');
require('./login/js/loginCtrl.js');
require('./inventory/objects/inventoryApp.js');
require('./inventory/objects/listInventoryCtrl.js');
require('./inventory/objects/editInventoryCtrl.js');
require('./DataServices/inventory.js');
require('./api_stubs/ruleset_stub.js');
require('./DataServices/rulesetDataService.js');