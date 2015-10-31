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
    $rootScope, $q, $state, $ionicPopup, $msgBox) {

  var config = {
    "senderID": "185225418332",
  },
      deferred;

  $rootScope.$on('$cordovaPush:notificationReceived', onNotification);

  function onRegistered(notification) {
    if (notification.regid.length > 0 ) {
      console.table('registration ID = ' + notification.regid);
      deferred.resolve(notification.regid);
    }
  }

  function goToState(newState) {
    if($state.is(newState)) {
       $state.reload();
    } else {
      $state.go(newState);
    }
  }

  function switchState(state) {
    switch(state) {
      case 'friend':
        goToState('app.friendList');
        break;
      case 'group':
        goToState('app.groupList');
        break;
      case 'pre_wutudu':
        goToState('app.group');
        break;
      default:
        break;
    }
  }

  function onMessage(notification) {
    // this is the actual push notification. its format depends on the data model from the push server
    console.debug('message = ' + notification.message);
    console.debug('notification ', JSON.stringify(notification));

    switchState(notification.payload.state);
    $ionicPopup.alert({
      title: 'notification',
      template: '<div class="card">' +
                  '<div class="item item-text-wrap">' +
                    notification.message +
                  '</div>' +
                '</div>'
    });
  }

  function onNotification(event, notification) {
    switch(notification.event) {
      case 'registered':
        onRegistered(notification);
        break;

      case 'message':
        onMessage(notification);
        break;

      case 'error':
        console.debug('GCM error = ' + notification.msg);
        break;

      default:
        console.debug('An unknown GCM event has occurred');
        break;
    }
  }

  return {
    register: function() {
      deferred = $q.defer();

      $ionicPlatform.ready(function() {
        $cordovaPush.register(config).then(function(result) {
          // Success
          console.debug(result);
        }, function(err) {
          // Error
          console.error(result);
        });
      });

      return deferred.promise;
    }
  };

});

