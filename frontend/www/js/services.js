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
  var urlRoot = "http://localhost:5000";
  // var urlRoot = "https://stormy-hollows-9187.herokuapp.com";

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

.factory('$wutuduNotification', function($q,
  $ionicPush, $ionicPopup, $msgBox) {

  return {
    register: function() {
      return $q(function(resolve, reject) {
        var config = {
          "onNotification": function (notification) {
            var msgObj = {
                title: 'Cordova notification',
                template: '<span>' + JSON.stringify(notification) + '</span>'
              },
              payload = notification.payload;
            console.log(notification, payload);
            $msgBox.show(msgObj);
          },
          "onRegister": function(data) {
            $msgBox.show(null, {
              title: 'Register notification',
              template: '<span>'+ JSON.stringify(data) + '</span>',
            });
            if(data.token) {
              console.log(data.token);
              resolve(data.token);
            } else {
              reject();
            }
          }
        };
        $ionicPush.init(config);
        $ionicPush.register();
      });
    }
  };

});
