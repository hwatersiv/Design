var entitiesModule = angular.module('marketplace.entities');

entitiesModule.factory('BuyCampaign',
  function(CreativeZone, Notification, AppConstants, $http, $q) {

    var BuyCampaign = {};

    BuyCampaign.buyCampaigns = [];
    
    BuyCampaign.costTypes = {
      CPC: 1,
      CPM: 2,
      IMPRESSIONS: 3,
      FLATRATE: 4,
      FREE: 5,
      ADDON: 6,
      MANUAL: 7
    };

    BuyCampaign.getStringForCostType = function (typeId) {
      return {
        1: 'CPC',
        2: 'CPM',
        3: 'Impressions',
        4: 'Flat Rate',
        5: 'Free',
        6: 'Add On',
        7: 'Manual'
      }[typeId];
    };

    function format(campaign) {
      var converted = angular.copy(campaign);

      converted.id = parseFloat(converted.id);
      converted.startDate = new Date(campaign.startDate * 1000);
      converted.endDate = new Date(campaign.endDate * 1000);

      converted.versionNumber = new Date(campaign.versionNumber * 1000);
      converted.createDate = new Date(campaign.createDate * 1000);
      converted.enabled = (campaign.enabled !== '0' && campaign.enabled !== false);

      converted.orders = converted.orders || [];
      converted.orders.forEach(function (lineItem) {
        lineItem.expectedStartDate = new Date(lineItem.expectedStartDate * 1000);
        lineItem.expectedEndDate = new Date(lineItem.expectedEndDate * 1000);
        lineItem.createDate = new Date(lineItem.createDate * 1000);
      })

      return converted;
    }

    BuyCampaign.getBuyCampaigns = function(){
      var url = AppConstants.apiBaseURL + 'buycampaigns';

      return $http.get(url).then(function(res){

        // Mapped values are temporary fix until the backend php return integers as integers
        // add mapped integers ass need until issue is resolved
        
        _.mapValues(res.data, function (i) {
          i.id = parseFloat(i.id);
          i.enabled = parseFloat(i.enabled);
          i.createDate = parseFloat(i.createDate);
          i.endDate = parseFloat(i.endDate);
          i.startDate = parseFloat(i.startDate);
          i.versionNumber = parseFloat(i.versionNumber);
        });

        BuyCampaign.buyCampaigns = res.data;

        return BuyCampaign.buyCampaigns;
      });
    };

    BuyCampaign.getBuyCampaign = function(id){
      var url = AppConstants.apiBaseURL + 'buycampaigns/' + id;

      return $http.get(url).then(function(res){
        var buyCampaign = format(res.data);
        return buyCampaign;
      });
    };

    BuyCampaign.getBuyCampaignCreativeZones = function(id){
      var url = AppConstants.apiBaseURL + 'buycampaigns/' + id + '/creativezones';

      return $http.get(url).then(
        function (res){
          return res.data;
        },
        function (res){
          Notification.addHTTP(res);
          return $q.reject(res.data);
        });
    };

    BuyCampaign.delete = function(id) {
      var url = AppConstants.apiBaseURL + 'buycampaigns/'+ id;

      return $http.delete(url).then(
        function (res) {
        // update cached list of BuyCampaigns
          BuyCampaign.buyCampaigns = _.filter(BuyCampaign.buyCampaigns, function(i) { return i.id != id });

          return res.data;
        },
        function (res) {
          Notification.addHTTP(res);
          return $q.reject(res.data);
        });
      };

    BuyCampaign.save = function(campaign) {
      var url = AppConstants.apiBaseURL + 'buycampaigns';
      
      if (campaign.id) {
        url += '/' + campaign.id;
      }

      var converted = angular.copy(campaign);
        converted.startDate = new Date(campaign.startDate) / 1000;
        converted.endDate = new Date(campaign.endDate) / 1000;

        converted.versionNumber = new Date(campaign.versionNumber) / 1000;
        converted.createDate = Date.now() / 1000;

      return $http.post(url, converted).then(
        function (res){
          // update cached list of BuyCampaigns
          BuyCampaign.buyCampaigns = _.filter(BuyCampaign.buyCampaigns, function(i) { return i.id != res.data.id });
          BuyCampaign.buyCampaigns.push(res.data);

          return res.data;
          },
        function (res){
          Notification.addHTTP(res);
          return $q.reject(res.data);
      });
    };
      ///////////////////// Line Items /////////////////////////
    BuyCampaign.saveLineItem = function(data){
      var url = AppConstants.apiBaseURL + 'buyorders';

      if(data.id){
        url += '/' + data.id;
      }

      var lineItem = angular.copy(data);

      lineItem.buyCampaignId = parseInt(lineItem.buyCampaignId);
      lineItem.creativeZoneId = parseInt(lineItem.creativeZoneId);
      lineItem.publisherId = parseInt(lineItem.publisherId);
     
      if (!lineItem.expectedStartDate){
        lineItem.expectedStartDate = -1;
      }
      else{
        lineItem.expectedStartDate = lineItem.expectedStartDate.getTime() / 1000;
      };

      if (!lineItem.expectedEndDate){
        lineItem.expectedEndDate = 0;
      }
      else{
        lineItem.expectedEndDate = lineItem.expectedEndDate.getTime() / 1000;
      };

      return $http.post(url, lineItem).then(
        function (res){
          return res.data;
        },
        function (res){
          Notification.addHTTP(res);
          return $q.reject(res.data);
        });
    };

    BuyCampaign.deleteLineItem = function(id){
      var url = AppConstants.apiBaseURL + 'buyorders/' + id;

      return $http.delete(url).then(
        function (res){
          return res.data;
        },
        function (res) {
          Notification.addHTTP(res);
          return $q.reject(res.data);
        });
    };

    return BuyCampaign;
});
