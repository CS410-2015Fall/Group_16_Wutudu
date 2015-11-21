angular.module('starter.controllers')

.controller('WutuduDetailsCtrl', function($scope, $stateParams, $state, $ionicModal, $ionicPlatform,
  $cordovaGeolocation, GoogleMap, $cordovaInAppBrowser, ErrorPopup) {

  var groupId = $stateParams.groupId,
      wutuduId = $stateParams.wutuduId,
      config = {
        groupId: groupId,
        wutuduId: wutuduId
      };

  (function init () {
    if (!$stateParams.wutudu) {
      $state.go('app.group', config);
      return;
    }
    $scope.wutudu = formatWutudu($stateParams.wutudu);
    $scope.wutudu.event_details = $scope.wutudu.event_details || {};
    var wut = $scope.wutudu;
    $scope.lat = wut.event_details.location.lat || parseFloat(wut.latitude),
    $scope.lng = wut.event_details.location.long || parseFloat(wut.longitude);
    GoogleMap.initMap(document.getElementById('wutuduDetailMap'), $scope.lat, $scope.lng);
    initModal();
  })();

  function formatWutudu(wutudu) {
      var eventDate = new Date(wutudu.event_time),
          stringDate = eventDate.toString();
      stringDate = stringDate.substring(0, stringDate.indexOf(eventDate.toTimeString()));

      // Extract the time from the date object
      var meridian = ['AM', 'PM'];
      var hours = eventDate.getHours();
      var minutes = eventDate.getMinutes();
      var hoursRes = hours > 12 ? (hours - 12) : hours;
      var currentMeridian = meridian[parseInt(hours / 12)];
      var displayHours = ('00' + hoursRes).slice(-2);
      var displayMinutes = ('00' + minutes).slice(-2);
      wutudu.display_time = stringDate + displayHours + ':' + displayMinutes + ' ' + currentMeridian;
    return wutudu;
  }

  function initModal() {
    var optionsTplUrl = 'templates/wutudu/directionsMapPopup.html',
        modelConfig = {
            scope: $scope,
            animation: 'slide-in-up'
        };
    $ionicModal
      .fromTemplateUrl(optionsTplUrl, modelConfig)
      .then(setupModal);
  }

  function setupModal(modal) {
    $scope.modal = modal;
  }

  function onExit(e) {
    $scope.modal.remove();
  }

  function initLocation () {
    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position) {
        var lat  = position.coords.latitude;
        var lng = position.coords.longitude;
        $scope.startLocation.lat = lat;
        $scope.startLocation.lng = lng;
        GoogleMap.setMarkerPosition(lat, lng, {pan: true});
    }, function (err) {
      console.log(err);
      ErrorPopup.display('Map Location Error', err.message);
    });
  }

  function setStartLocationWithEvent (event) {
    var lat = event.latLng.lat();
    var lng = event.latLng.lng();
    setStartLocation(lat, lng);
  }

  $scope.setStartLocation = function (lat, lng) {
    GoogleMap.setMarkerPosition(lat, lng, {pan: true});
    $scope.startLocation.lat = lat;
    $scope.startLocation.lng = lng;
    $scope.$apply();
  }

  $scope.displayRating = function () {
    var wut = $scope.wutudu;
    if (!wut) {
      return '';
    }
    var ratings = wut.event_details.rating || {rating: 0, count:0};
    return ratings.value + ' (' + ratings.count + ' votes)';
  };

  $scope.openLink = function(url) {
    var options = {
          location: 'no',
          clearcache: 'yes'
        };
    $cordovaInAppBrowser.open(url, '_blank', options);
  };

  $scope.expandMap = function() {
    $scope.modal.show();
    var dirMap = document.getElementById('directionsMap');
    var directionsMapSearch = document.getElementById('directionsAutoComplete');
    if (GoogleMap.initMap(dirMap, $scope.lat, $scope.lng, {clickHandler: setStartLocationWithEvent})) {
      $ionicPlatform.ready(function () {
        initLocation();
      });
    }
    $scope.startLocation = {
      lat: $scope.lat,
      lng: $scope.lng
    };
  };

  $scope.getDirectionsFromLocation = function () {
    console.log($scope.startLocation)
    $scope.modal.hide();
    GoogleMap.initMap(document.getElementById('wutuduDetailMap'), $scope.lat, $scope.lng);
    GoogleMap.getDirections($scope.startLocation.lat, $scope.startLocation.lng, $scope.lat, $scope.lng); 
  };

  $scope.closeDirectionsPopup = function() {
    $scope.modal.hide();
  };
});
