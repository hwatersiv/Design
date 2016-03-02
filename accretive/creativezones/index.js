module.exports = angular.module('marketplace.creativezones', []);
// Publisher Views
require('./CreativeZones.ctrl');
require('./CreativeZonesList.ctrl');
    
// Single Publisher Views
require('./CreativeZone.ctrl');
require('./new/CreativeZonesCreate.ctrl');
require('./info/CreativeZoneInfo.ctrl');
require('./rotation/CreativeZoneRotation.ctrl');