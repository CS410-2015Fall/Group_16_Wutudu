angular.module('starter.services', [])

.factory('AppFactory', function() {

})

.factory('$localstorage', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    remove: function(key) {
      return key && delete $window.localStorage[key];
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  };
})

.factory('$httpService', function($http, User) {
  // var urlRoot = "http://localhost:5000";
  var urlRoot = "https://stormy-hollows-9187.herokuapp.com";

  return {
    makeRequest: function(config) {
      if(!config) throw "No config for http";
      if(!config.method || !config.url) throw "One or more config missing";
      var token = User.getSession(),
          headers = {
            'Content-Type': 'application/json',
            'Authorization' : 'Token token=' + token
          },
          httpConfig = {
            method: config.method,
            data: config.data,
            headers: angular.merge(headers, config.headers),
            url: urlRoot + config.url,
          };
      return $http(httpConfig);
    }
  };
})

.factory('$msgBox', function($ionicPopup) {
  return {
    show: function($scope, msg) {
      var data = {
         template: msg.template,
         templateUrl: msg.templateUrl,
         title: msg.title,
         scope: $scope,
         buttons: [{ text: 'Ok', type: 'button-positive'}]
      };
      $ionicPopup.show(data);
    }
  };
})

.factory('$wutuduNotification', function($ionicPlatform, $cordovaPush,
    $rootScope, $q, $ionicPopup, $msgBox) {

  return {
    register: function() {
      return $q(function(resolve, reject) {
        $ionicPlatform.ready(function() {
          var androidConfig = {
            "senderID": "185225418332",
            "forceShow": true
          };
          $cordovaPush.register(androidConfig).then(function(result) {
            // Success
            console.debug(result);
          }, function(err) {
            // Error
            console.error(result);
          });

          $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
            switch(notification.event) {
              case 'registered':
                if (notification.regid.length > 0 ) {
                  console.table('registration ID = ' + notification.regid);
                  resolve(notification.regid);
                }
                break;

              case 'message':
                // this is the actual push notification. its format depends on the data model from the push server
                console.debug('message = ' + notification.message + ' msgCount = ' + notification.msgcnt);
                break;

              case 'error':
                console.debug('GCM error = ' + notification.msg);
                break;

              default:
                console.debug('An unknown GCM event has occurred');
                break;
            }
          });
        });
      });
    }
  };

});
