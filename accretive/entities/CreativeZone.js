var entitiesModule = angular.module('marketplace.entities');

entitiesModule.factory('CreativeZone', 
  function(Rotation, AppConstants, Notification, $http) {

    var CreativeZone = {};

    CreativeZone.creativeZones = [];

    CreativeZone.types = {
      POPUNDER: 4,
      IFRAME: 1,
      NAVILINK: 7,
      IMAD: 2
    };

    CreativeZone.getStringForType = function (typeId) {
      return {
        4: "Popunder",
        1: "IFrame",
        7: "Navi Link",
        2: "IM Ad"
      }[typeId];
    };

    CreativeZone.getTypeIds = function () {
      return [
        {"typeName":"IFrame","typeId":"1","typeCode":"a","directory":"if","locationRequired":"1","dimensionsRequired":"1"},
        {"typeName":"IM Ad","typeId":"2","typeCode":"b","directory":"im","locationRequired":"0","dimensionsRequired":"0"},
        {"typeName":"Popup UNSUPPORTED!!!","typeId":"3","typeCode":"c","directory":"po","locationRequired":"0","dimensionsRequired":"0"},
        {"typeName":"Popunder","typeId":"4","typeCode":"d","directory":"pu","locationRequired":"0","dimensionsRequired":"0"},
        {"typeName":"Preroll","typeId":"5","typeCode":"e","directory":"pr","locationRequired":"0","dimensionsRequired":"1"},
        {"typeName":"Navigation Link","typeId":"7","typeCode":"f","directory":"nl","locationRequired":"0","dimensionsRequired":"0"}
      ];
    };

    CreativeZone.getLocations = function () {
      return [
        {location: "Header", creativeZoneLocation_code: "a"},
        {location: "Skyscraper", creativeZoneLocation_code: "b"},
        {location: "Content", creativeZoneLocation_code: "c"},
        {location: "Footer", creativeZoneLocation_code: "d"},
        {location: "N/A", creativeZoneLocation_code: ""},
        {location: "Interstitial", creativeZoneLocation_code: "e"},
        {location: "IMAD Window", creativeZoneLocation_code: "f"},
        {location: "IMAD Taskbar", creativeZoneLocation_code: "g"}
      ];
    };

    CreativeZone.getAllCreativeZones = function(){
      var url = AppConstants.apiBaseURL + "creativezones";

      return $http.get(url).success(function (res){

        return CreativeZone.creativeZones = res;
      });
    };

    CreativeZone.getCreativeZone = function(id){
      var url = AppConstants.apiBaseURL + "creativezones/" + id;

      var onSuccess = function (res) {
        var cz = res.data;
        cz.publisher = {id: cz.publisherId, name: cz.publisherName};
        cz.width = parseInt(cz.width, 10);
        cz.height = parseInt(cz.height, 10);
        cz.ruleSets = cz.ruleSets || []; // default to empty
        // get default rotation
        return Rotation.getRotation(cz.defaultRotationId).then(function (res){
          cz.defaultRotation = res.data;
          return cz;
        });
      };
      var onError = function (res) {
        Notification.addHTTP(res);
        return $q.reject(res.data);
      };

      return $http.get(url).then(onSuccess, onError);
    };

    CreativeZone.getTemplateVariables = function (id) {
      var url = AppConstants.apiBaseURL + "entities_template/" + "CreativeZone/" + id;

      return $http.get(url).then(
        function (res) {
          var czTempVars = res.data.variables;

          return czTempVars;
        },
        function (res) {
          console.log("error: ",res);
        });
    };

    CreativeZone.delete = function (czId){
      var url = AppConstants.apiBaseURL + "creativezones/" + czId;

      return $http.delete(url).then(
        function (res) {
          return res;
        },
        function (res) {
          Notification.addHTTP(res);
          return $q.reject(res.data);
        });
    };

    // updates and creates creative zones
    CreativeZone.save = function(creativeZone){ 
      var url = AppConstants.apiBaseURL + 'creativezones';

      if(creativeZone.id) {
        url += '/' + creativeZone.id;
      }

      if(!creativeZone.publisherId){
        if(!creativeZone.publisher.id){
          Notification.addNotification("You must select a Publisher to save a Creative Zone", "danger");
        }else{
          creativeZone.publisherId = creativeZone.publisher.id;
        }  
      };

      return $http.post(url, creativeZone).then(function (res) {

        var creativeZone = res.data;

        // set new variants to the id number
        if(creativeZone.variant == -1){
          creativeZone.variant == creativeZone.id;
          CreativeZone.save(creativeZone);
        }
        else{
          // update cached list of Creative Zones
          CreativeZone.creativeZones = _.filter(CreativeZone.creativeZones, function (i) { return i.id != res.data.id });
          CreativeZone.creativeZones.push(res.data);

          creativeZone.width = parseInt(creativeZone.width, 10);
          creativeZone.height = parseInt(creativeZone.height, 10);
          // Compile the email template
          creativeZone.resolvedEmailCodeTemplate = CreativeZone.compileCZEmailTemplate(creativeZone);
          // get the Rotations for the creative zone
          Rotation.getRotation(creativeZone.defaultRotationId).then( function (response) {
            creativeZone.defaultRotation = response.data;
            creativeZone.publisher = {};
            creativeZone.publisher.id = creativeZone.publisherId;
            creativeZone.publisher.name = creativeZone.publisherName;
          });
          return creativeZone;
        }
      });
    };

    // needs simplified
    CreativeZone.compileCZEmailTemplate = function(cz){
      var template = cz.emailCodeTemplate;

      try
      {
          template = template.replace(/\{\{\s*publisher\s*\}\}/g, cz.publisherName.toLowerCase());
      }
      catch(err){}
      try
      {
          template = template.replace(/\{\{\s*width\s*\}\}/g, 1000);
          template = template.replace(/\{\{\s*height\s*\}\}/g, cz.height);
      }
      catch(err){}
      try
      {
          template = template.replace(/\{\{\s*variant\s*\}\}/g, cz.variant);
      }
      catch(err){}
      try
      {
          if(typeof cz.subadtype == "undefined" || cz.subadtype == null){
              var subadtype = "";
          } else{
              var subadtype = "&subadtype=" + cz.subadtype
          }
          template = template.replace(/\{\{\s*sub\s*\}\}/g, subadtype);
      }
      catch(err){}

      if(template.search(/\{\{\s*vars\.[a-zA-Z0-9_]*\s*\}\}/g) >= 0){
        var url = AppConstants.apiBaseURL + "creativezones/" + cz.id + "/template_variables";

        return $http.get(url).then(
          function (res) {
            try{

              for(var i = 0;i < res.length;i++){

                try{

                  var regExpr = new RegExp("{{\\s*vars\\." + res[i].type_id + "\\s*}}", 'g');
                  if(template.search(regExpr) >= 0){
                    template = template.replace(regExpr, res[i].value);
                  }
                }
                catch(err){}
              };

            // what ever left should be replaced with blank
                try{
                  template = template.replace(/\{\{\s*[.a-zA-Z0-9_]*\s*\}\}/g, '');
                }
                catch(err){}
            }
            catch(err){}
            cz.resolvedEmailCodeTemplate = template;
            return cz.resolvedEmailCodeTemplate;
          },
          function (res) {
            cz.resolvedEmailCodeTemplate = template;
            return cz.resolvedEmailCodeTemplate;
          }
        );
      }
      else{
        cz.resolvedEmailCodeTemplate = template;
        return cz.resolvedEmailCodeTemplate;
      }
    };

    CreativeZone.addRuleSet = function(czid, ruleSetId, targetRotationId) {
      var url = AppConstants.apiBaseURL + "creativezones/" + czid + "/rulesets/" + ruleSetId;

      return $http.post(url, {ruleSetId: ruleSetId, rotationId: targetRotationId}).success(function (res){
        
        return res;
      });
    };

    return CreativeZone;

  });

