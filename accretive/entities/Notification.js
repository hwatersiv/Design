var entitiesModule = angular.module('marketplace.entities');

entitiesModule.service('Notification',function() {
  var Notification = {};
  
  Notification.messages = [];

  Notification.status = {
    500: "danger",
    400: "danger",
    200: "success"
  };

  Notification.addNotification = function(msg, type) {
    var alert = {
      msg: msg,
      type: (type? type : "info")
    } 

    Notification.messages.push(alert);
  };

  var getStatusClass = function(status) {
    return Notification.status[status];
  };

  Notification.addHTTP = function(res) {
    var msg = "Unknown";
    var type = "danger"
    
    if(res){
      if(res.data && res.data.error){
        msg = res.data.error;
      }
      if(res.status){
        type = getStatusClass(res.status);
      }     
    }

    Notification.addNotification(msg, type);
  };

  Notification.closeAlert = function(index) {
    Notification.messages.splice(index, 1);
  };

  return Notification;

});