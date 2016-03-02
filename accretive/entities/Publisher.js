var entitiesModule = angular.module('marketplace.entities');

entitiesModule.factory('Publisher',
  function(Notification,AppConstants, $http, $q) {

    var Publisher = {};

    Publisher.publishers = [];

    Publisher.getPublishers = function(){
      var url = AppConstants.apiBaseURL + 'publishers';

      return $http.get(url).then(
        function (res){
          _.mapValues(res, function (i) {
            i.id = parseFloat(i.id);
          });
          Publisher.publishers = res.data;

          return Publisher.publishers;
        },
        function (res) {
          Notification.addHTTP(res);
          return $q.reject(res.data);
        });
    };

    Publisher.getPublisher = function(id){
      var url = AppConstants.apiBaseURL + 'publishers/' + id;

      return $http.get(url).then(function (res) {
        var publisher = res.data;
          publisher.id = parseInt(publisher.id);
          publisher.createDate = new Date(parseInt(publisher.createDate, 10));
          publisher.versionNumber = new Date(parseInt(publisher.versionNumber, 10));
      
        return publisher;
      });
    };

    Publisher.getCreativeZones = function(pubId){
      var url = AppConstants.apiBaseURL + 'publishers/' + pubId + '/creative_zones';
      
      return $http.get(url).success(
        function (res) {
          // Mapped values are temporary fix until the backend php return integers as integers
          // add mapped integers ass need until issue is resolved
          _.mapValues(res, function (i) {
            i.id = parseFloat(i.id);
          });
          return res;
        },
        function (res) {
          Notification.addHTTP(res);
          return $q.reject(res.data);
        });
    };

    Publisher.getTemplateVariables = function(pubId){
      var url = AppConstants.apiBaseURL + 'publishers/' + pubId + '/template_variables';

      return $http.get(url).then(
        function (res) {
          var tempVars = res.data;

          _.mapValues(tempVars, function (i) {
            i.id = parseFloat(i.id);
            i.createDate = parseFloat(i.createDate);
            i.versionNumber = parseFloat(i.versionNumber);
            i.isEditable = parseFloat(i.isEditable);
            i.publishersList = parseFloat(i.publishersList);
          });

          return tempVars;
        },
        function (res) {
          Notification.addHTTP(res);
          return $q.reject(res.data);
        });
    };

    // updates and creates publishers
    Publisher.save = function(publisher){
      var url = AppConstants.apiBaseURL + 'publishers';

      if(publisher.id) {
        url += '/'+ publisher.id;
      }

      return $http.post(url, publisher).then(
        function (res) {
          // update cached list of Publishers
          var pos = _.findIndex(Publisher.publishers, function (i) { return i.id == res.data.id });
          if (pos !== -1) {
            // replace existing publisher
            Publisher.publishers[pos]= res.data;
          } else {
            // new publisher, append to the list
            Publisher.publishers.push(res.data);
          }
        
          return res.data;
        },
        function (res) {
          Notification.addHTTP(res);
          return $q.reject(res.data);
        });
    };

    Publisher.delete = function(pubId){
      var url = AppConstants.apiBaseURL + 'publishers/' + pubId;

      return $http.delete(url).then(
        function (res) {
          Publisher.publishers = _.filter(Publisher.publishers, function (p) { return p.id != pubId });
          return res;
        },
        function (res) {
          Notification.addHTTP(res);
          return $q.reject(res.data);
        });
    };

    return Publisher;
  });