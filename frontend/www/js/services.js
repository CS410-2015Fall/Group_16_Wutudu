angular.module('starter.services', [])

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
            'Authorization' : 'Token token=' + token,
            'Device-Token': config.deviceToken
          },
          httpConfig = {
            method: config.method,
            data: config.data,
            headers: headers,
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

  function onRegistered(notification) {
    if (notification.regid.length > 0 ) {
      console.debug('registration ID = ' + JSON.stringify(notification));
      deferred.resolve(notification.regid);
    }
  }

  function goToState(newState, params) {
    if($state.is(newState)) {
       $state.reload();
    } else {
      $state.go(newState, params);
    }
  }

  function switchState(payload) {
    var stateConfig = {};
    switch(payload.state) {
      case 'friend':
        goToState('app.friendList');
        break;
      case 'group':
        goToState('app.groupList');
        break;
      case 'pre_wutudu':
        stateConfig = {
          groupId: payload.group.id,
          preWutudu:  payload.pre_wutudu,
          wutuduId: payload.pre_wutudu.pre_wutudu_id
        };
        goToState('app.answerWutudu',stateConfig);
        break;
      case 'wutudu':
        stateConfig = {
          groupId: payload.group.id,
          wutudu: payload.wutudu_event,
          wutuduId: payload.wutudu_event.id
        };
        goToState('app.wutuduDetails', stateConfig);
        break;
      default:
        break;
    }
  }

  function onMessage(notification) {
    // this is the actual push notification. its format depends on the data model from the push server
    console.debug('message = ' + notification.message);
    console.debug('notification ', JSON.stringify(notification));

    var popup = $ionicPopup.show({
      title: 'Notification',
      template: '<div class="card">' +
                  '<div class="item item-text-wrap">' +
                    notification.message +
                  '</div>' +
                '</div>',
      buttons: [
        {
          text: 'Cancel',
          type: 'button-default',
          onTap: function(e) {
            popup.close();
          }
        },
        {
          text: 'OK',
          type: 'button-positive',
          onTap: function(e) {
            switchState(notification.payload);
          }
        }
      ]
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
      $rootScope.$on('$cordovaPush:notificationReceived', onNotification);
      $ionicPlatform.ready(function() {
        $cordovaPush.register(config).then(function(result) {
          console.debug(result);
        }, function(err) {
          console.error(err);
        });
      });
      return deferred.promise;
    }
  };

})

.factory('Auth', function($httpService) {
  return {
    logout: function() {
      var payload = {
        method: 'DELETE',
        url: '/logout'
      };
      return $httpService.makeRequest(payload);
    }
  };
})

.factory('GoogleMap', function() {
  var map, marker;

  return {
    initMap: function(el, lat, lng, config) {
      config = config || {};
      if (!google.maps.Map) {
        return false;
      } else {
        map = new google.maps.Map(el, {
          center: {lat: lat, lng: lng},
          zoom: 15
        });
        marker = new google.maps.Marker({
          position: {lat: lat, lng: lng},
          map: map,
          title: 'This location'
        });
        if (config.clickHandler) {
          map.addListener('click', config.clickHandler);
        }
        return true;
      }
    },
    setMarkerPosition: function (lat, lng, config) {
      config = config || {};
      marker.setPosition({
        lat: lat,
        lng: lng
      });
      if (config.pan) {
        map.panTo(marker.getPosition());
      }
    }
  };
});