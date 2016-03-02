module.exports = angular.module('marketplace.publishers', []);
// Publisher Views
require('./Publishers.ctrl');
require('./PublishersList.ctrl');
    
// Single Publisher Views
require('./Publisher.ctrl');
require('./new/PublishersCreate.ctrl');
require('./info/PublisherInfo.ctrl');
require('./creativezones/Zones.ctrl');