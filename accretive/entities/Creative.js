var entitiesModule = angular.module('marketplace.entities');

entitiesModule.factory('Creative',
    function(Notification, AppConstants, $http, $q) {
        var Creative = {};
        Creative.Creatives = [];


        Creative.getCreatives = function(){
            url = AppConstants.apiBaseURL + 'creatives/';
            return $http.get(url).then(function(res){
                Creative.Creatives = res.data;
                return res.data;
            });
        };

        Creative.getCreative = function(input){
            url = AppConstants.apiBaseURL + 'creatives/'+input.id;
            return $http.get(url).then(function(res){
                return res.data;
            });
        };

        Creative.getCreativeTypes = function(){
            url = AppConstants.apiBaseURL + 'entities_template/Creative';
            return $http.get(url).then(function(res){
                Creative.options = res.data.options;
                return Creative.options;
            });
        };

        Creative.delete = function(id) {
            var url = AppConstants.apiBaseURL + 'creatives/'+ id;
            return $http.delete(url).then(function(res){
                // update cached list of Creatives
                Creative.Creatives = _.filter(Creative.Creatives, function(i) { return i.typeId != id });
                return res.data;
            });
        };

        Creative.save = function(creative) {
            var url = AppConstants.apiBaseURL + 'creatives';
            if (creative.id) {
                url += '/' + creative.id;
            }
            return $http.post(url, creative).then(function (res){
                    // update cached list of Creatives
                    Creative.Creatives = _.filter(Creative.Creatives, function(i) { return i.typeId != res.data.typeId });
                    Creative.Creatives.push(res.data);
                    Creative.getCreatives();
                    return res.data;
                },
                function (res) {
                    Notification.addHTTP(res);
                    return $q.reject(res.data);
                });
        };

        return Creative;
    });