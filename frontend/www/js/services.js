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
    },
    clearAll: function() {
      $window.localStorage.clear();
    }
  };
})

.factory('$httpService', function($http, User, $localstorage,
  $q, $cordovaNetwork, $ionicPopup, $device) {
  // var urlRoot = "http://localhost:5000",
  var urlRoot = "https://stormy-hollows-9187.herokuapp.com",
      deferred;

  return {
    makeRequest: function(config) {
      if(!config) throw "No config for http";
      if(!config.method || !config.url) throw "One Or More Config Missing";
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
        configUrl = config.url;
        function successCache(response) {
          $localstorage.setObject('GET ' + config.url, response);
          deferred.resolve(response);
        }

        function errorCache(response) {
          deferred.reject(response);
        }

      if (!$device.isBrowser() && $cordovaNetwork.isOffline()) {
        if (config.method == 'GET') {
          return $q(function(success, error) {
                      var response = $localstorage.getObject('GET ' + config.url);
                      if (response) {
                        success(response);
                      } else {
                        $ionicPopup.alert({
                          title: 'Connection Error',
                          template: 'Internet Connection Unavailable',
                          cssClass: 'alert-error'
                        });
                      }
                    });
        } else {
          var response = {
                           status: 400,
                           data: {
                            errors: 'Internet Connection Unavailable'
                           }
                         };
          return $q.reject(response);
        }
      } else {
        if (config.method == 'GET') {
          deferred = $q.defer();
          var httpPromise = $http(httpConfig);
          httpPromise.then(successCache, errorCache);
          return deferred.promise;
        } else {
          return $http(httpConfig);
        }
      }
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
    $rootScope, $q, $state, $ionicPopup, $msgBox, $device, $cordovaNetwork) {

  var config = {
    "senderID": "185225418332",
  },
      deferred;

  function onRegistered(notification) {
    if (notification.regid.length > 0 ) {
      console.debug('registration ID = ' + JSON.stringify(notification));
      deferred.resolve(notification.regid);
    } else {
      console.debug('can\'t register');
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
          preWutudu: payload.pre_wutudu,
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
        console.debug('An Unknown GCM Event Has Occurred');
        break;
    }
  }

  function webRegister() {
    var mockDeviceId = 1;
    return $q.resolve(mockDeviceId);
  }

  function mobileRegister() {
    deferred = $q.defer();
    $rootScope.$on('$cordovaPush:notificationReceived', onNotification);
    $ionicPlatform.ready(function() {
      $cordovaPush.register(config).then(function(result) {
        debugger;
        console.debug(result);
      }, function(err) {
        debugger;
        console.error(err);
      });
    });
    return deferred.promise;
  }

  return {
    register: function() {
      if ($device.isBrowser()) {
        return webRegister();
      } else {
        if ($cordovaNetwork.isOnline()) {
          return mobileRegister();
        } else {
          return $q.resolve(1);
        }
      }
    }
  };

})

.factory('Auth', function($httpService) {
  return {
    login: function (config) {
      var payload = {
        method: 'POST',
        data: {
          'login' : config.loginCreds
        },
        url: '/login',
        deviceToken: config.deviceToken
      };
      return $httpService.makeRequest(payload);
    },
    signup: function (config) {
      var payload = {
        method: 'POST',
        data: {
          'user' : config.user
        },
        url: '/users',
        deviceToken: config.deviceToken
      };
      return $httpService.makeRequest(payload);
    },
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
    },
    mapSetZoom: function (zoom) {
      map.setZoom(zoom);
    },
    getDirections: function (startlat, startlng, lat, lng, config) {
      var directionsDisplay = new google.maps.DirectionsRenderer;
      var directionsService = new google.maps.DirectionsService;
      directionsDisplay.setMap(map);
      directionsService.route({
        origin: {lat: startlat, lng: startlng},
        destination: {lat: lat, lng: lng},
        travelMode: google.maps.TravelMode.DRIVING
        //   // Note that Javascript allows us to access the constant
        //   // using square brackets and a string value as its
        //   // "property."
      }, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });
    }
  };
})


.factory('internalErrorPopup', function($ionicPopup) {
  return {
    display: function() {
      $ionicPopup.alert({
        title: 'Internal Server Error',
        template: 'Services Unavailable',
        cssClass: 'alert-error'
      });
    }
  };
})

.factory('ErrorPopup', function($ionicPopup) {
  var internalErrors = [500, 102];

  function isServerError(status) {
    return internalErrors.indexOf(status) != -1;
  }

  function display(title, template) {
    $ionicPopup.alert({
      title: title,
      template: template,
      cssClass: 'alert-error'
    });
  }

  return {
    display: display,
    displayResponse: function(status, title, template) {
      if (isServerError(status)) {
        display('Internal Server Error', 'Services Unavailable');
      } else {
        display(title, template);
      }
    }
  };
})

.factory('$device', function() {
  function isBrowser() {
    return !window.cordova;
  }

  return {
    isBrowser: isBrowser
  };
});
