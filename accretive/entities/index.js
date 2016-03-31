// define the angular module for entities
var entitiesModule = angular.module('marketplace.entities', []);

// load all the entities here to make them avaliable
// when we require this module
require('./AdDimension');
require('./AdLocation');
require('./AdType');
require('./Advertiser');
require('./BuyCampaign');
require('./Country');
require('./Creative');
require('./CreativeZone');
require('./JoinType');
require('./Language');
require('./Note');
require('./Notification');
require('./Platform');
require('./Publisher');
require('./Rotation');
require('./Rule');
require('./RuleEnumValue');
require('./RuleSetEnt');
require('./SavedReport');
require('./SellCampaign');
require('./TemplateVariable');
require('./User');

// export the name for use by other angular apps
module.exports = entitiesModule.name;