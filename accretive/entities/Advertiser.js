var entitiesModule = angular.module('marketplace.entities');

entitiesModule.factory('Advertiser',
    function(Notification, AppConstants, $http, $q) {

      var Advertiser = {};
      Advertiser.Advertisers = [];

      function format(advertiser) {
        var converted = angular.copy(advertiser);
        converted.id = parseInt(converted.id);
        converted.startDate = new Date(advertiser.startDate * 1000);
        converted.endDate = new Date(advertiser.endDate * 1000);
        converted.versionNumber = new Date(advertiser.versionNumber * 1000);
        converted.createDate = new Date(advertiser.createDate * 1000);
        converted.enabled = (advertiser.enabled !== '0' && advertiser.enabled !== false);
        converted.orders = converted.orders || [];
        return converted;
      }

      Advertiser.getAdvertisers = function(){
        url = AppConstants.apiBaseURL + 'advertisers/';
        return $http.get(url).then(function(res){
          Advertiser.Advertisers = res.data;
          return Advertiser.Advertisers;
        });
      };

      Advertiser.getAdvertiser = function(id){
        url = AppConstants.apiBaseURL + 'advertisers/'+id;
        return $http.get(url).then(function(res){
          return res.data;
        });
      };

      Advertiser.getAdvertiserCampaigns = function(id){
        url = AppConstants.apiBaseURL + 'advertisers/'+id+'/campaigns';
        return $http.get(url).then(function(res){
          return res.data;
        });
      };

      Advertiser.delete = function(id) {
        var url = AppConstants.apiBaseURL + 'advertisers/'+ id;
        return $http.delete(url).then(function(res){
          // update cached list of Advertisers
          Advertiser.Advertisers = _.filter(Advertiser.Advertisers, function(i) { return i.id != id });
          return res.data;
        });
      };

      Advertiser.save = function(advertiser) {
        var url = AppConstants.apiBaseURL + 'advertisers';
        if (advertiser.id) {
          url += '/' + advertiser.id;
        }

        return $http.post(url, advertiser).then(
            function (res){
              // update cached list of Advertisers
              Advertiser.Advertisers = _.filter(Advertiser.Advertisers, function(i) { return i.id != res.data.id });
              Advertiser.Advertisers.push(res.data);
              Advertiser.getAdvertisers();
              return res.data;
            },
            function (res){
              Notification.addHTTP(res);
              return $q.reject(res.data);
            });
      };
      ///////////////////// Line Items /////////////////////////
      Advertiser.saveLineItem = function(data){
        var lineItem = angular.copy(data);
        lineItem.AdvertiserId = parseInt(lineItem.AdvertiserId);
        lineItem.creativeZoneId = parseInt(lineItem.creativeZoneId);

        if (!lineItem.expectedStartDate){
          lineItem.expectedStartDate = -1;
        }
        else{
          lineItem.expectedStartDate = lineItem.expectedStartDate.getTime() / 1000;
        }

        if (!lineItem.expectedEndDate){
          lineItem.expectedEndDate = 0;
        }
        else{
          lineItem.expectedEndDate = lineItem.expectedEndDate.getTime() / 1000;
        }

        return $http.post(entitiesModule.getSaveURL('buyorders', lineItem.id), lineItem).then(
            function (res){
              return res.data;
            },
            function (res){
              Notification.addHTTP(res);
              return $q.reject(res.data);
            });
      };

      Advertiser.deleteLineItem = function(id){
        return $http.delete(AppConstants.apiBaseURL + 'buyorders/' + id).then(
            function (res){
              return res.data;
            },
            function (res) {
              Notification.addHTTP(res);
              return $q.reject(res.data);
            });
      };

      return Advertiser;
    });