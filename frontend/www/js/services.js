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
      // urlRoot = "https://stormy-hollows-9187.herokuapp.com";

  return {
    makeRequest: function(config) {
      if(!config) throw "No config for http";
      if(!config.method || !config.url) throw "One or more config missing";
      // use the token and make the constants
      var token = User.getSession(),
          httpConfig = {
            method: config.method,
            data: config.data,
            headers: {
             'Content-Type': 'application/json',
             'Authorization' : 'Token token=' + token
            },
            url: urlRoot + config.url,
          };
      return $http(httpConfig);
    }
  }
});
