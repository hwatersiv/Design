module.exports = angular.module('marketplace.sellcampaigns', []);
// Rotation Views
require('./SellCampaigns.ctrl');
require('./SellCampaignsList.ctrl');
    
// Single Rotation Views
require('./SellCampaign.ctrl');
require('./new/SellCampaignsCreate.ctrl');
require('./info/SellCampaignInfo.ctrl');
require('./rotation/SellCampaignRotation.ctrl');
require('./ruleset/SellCampaignRuleSet.ctrl');