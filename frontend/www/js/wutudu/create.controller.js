angular.module('starter.controllers')

.controller('WutuduCreateCtrl', function($scope, $stateParams, $state, $ionicPopup,
        $ionicModal, $msgBox, $ionicPlatform, $cordovaGeolocation, Friend, Group, Wutudu, GoogleMap) {
  var groupId = $stateParams.groupId,
      config = {
        groupId: groupId
      };

  var DEFAULT_LAT = 49.2827,
      DEFAULT_LNG = -123.1207;

  $scope.wutudu = {
    latitude: DEFAULT_LAT,
    longitude: DEFAULT_LNG,
  };

  (function init () {
    initDatePicker();
    initTimePicker();
    var mapEl = document.getElementById('createWutuduMap');
    var mapSearchEl = document.getElementById('createWutuduPlacesAutoComplete');
    if (GoogleMap.initMap(mapEl, DEFAULT_LAT, DEFAULT_LNG, {clickHandler: setLocationWithEvent})) {
      $ionicPlatform.ready(function () {
        initLocation();
      });
    }
  })();

  $scope.locationChange = function (wutudu) {
    var lat = parseFloat(wutudu.latitude);
    var lng = parseFloat(wutudu.longitude);
    GoogleMap.setMarkerPosition(lat, lng, {pan: true});
  };

  $scope.setLocation = function (lat, lng) {
    GoogleMap.setMarkerPosition(lat, lng, {pan: true});
    $scope.wutudu.latitude = lat;
    $scope.wutudu.longitude = lng;
    $scope.$apply();
  }

  $scope.cancelClick = function () {
    $state.go('app.group', config);
  };

  $scope.createWutudu = function (wutudu) {
    // if (!validateCreate(wutudu)) {
    //   return;
    // }
    var createConfig = {
      groupId: config.groupId,
      data: {'pre_wutudu' : {
        'event_date' : getEventTime(),
        'latitude' : wutudu.latitude,
        'longitude' : wutudu.longitude
      }}
    };
    Wutudu.createWutudu(createConfig)
    .then(function successCallback (response) {
      // $ionicPopup.alert({
      //   title: 'Successfully create wutudu'
      // }).then(function() {
      //   $state.go('app.group', config);
      // });
      $state.go('app.group', config);
    }, function errorCallback (response) {
      response.config.headers = JSON.stringify(response.config.headers);
      response.config.data = JSON.stringify(response.config.data);
      $scope.response = response;
      $ionicPopup.show({
        title: 'Create Wutudu',
        templateUrl: 'templates/errorPopup.html',
        scope: $scope,
        buttons: [{ text: 'OK' }]
      });
    });
  };

  $scope.displayTime = function (val) {
    if (!val) {
      return '00:00 AM'
    }
    var meridian = ['AM', 'PM'];
    var hours = parseInt(val / 3600);
    var minutes = (val / 60) % 60;
    var hoursRes = hours > 12 ? (hours - 12) : hours;
    var currentMeridian = meridian[parseInt(hours / 12)];
    var displayHours = ('00' + hoursRes).slice(-2);
    var displayMinutes = ('00' + minutes).slice(-2);
    return displayHours + ':' + displayMinutes + ' ' + currentMeridian;
  };

  function getEventTime () {
    var date = $scope.datepickerObject.inputDate;
    var time = $scope.timePickerObject.inputEpochTime;
    var hours = parseInt(time / 3600);
    var minutes = (time / 60) % 60;
    date.setHours(hours, minutes);
    return date.toJSON();
  }

  function validateCreate (wutudu)  {
    if (!wutudu.name) {
      $ionicPopup.alert({
        title: 'Failed to create Wutudu',
        template: 'The event name cannot be blank.'
      });
      return false;
    }
    return true;
  }

  function setLocationWithEvent (event) {
    var lat = event.latLng.lat();
    var lng = event.latLng.lng();
    setLocation(lat, lng);
  }

  function onDatePick (val) {
    if (typeof(val) === 'undefined') {
      console.log('No date selected');
    } else {
      $scope.datepickerObject.inputDate = val;
    }
  }

  function initDatePicker () {
    var start = new Date();
    start.setHours(0,0,0,0);
    var end = new Date(new Date().setYear(new Date().getFullYear() + 1)); // lol wth
    $scope.datepickerObject = {
      titleLabel: 'Pick a Date',  //Optional
      todayLabel: 'Today',  //Optional
      closeLabel: 'Close',  //Optional
      setLabel: 'Set',  //Optional
      setButtonType : 'button-balanced',  //Optional
      todayButtonType : 'button-positive',  //Optional
      closeButtonType : 'button-assertive',  //Optional
      inputDate: start,    //Optional
      mondayFirst: true,    //Optional
      templateType: 'popup', //Optional
      showTodayButton: 'true', //Optional
      modalHeaderColor: 'bar-positive', //Optional
      modalFooterColor: 'bar-positive', //Optional
      from: start,//new Date(2012, 8, 2),   //Optional
      to: end,    //Optional
      callback: onDatePick //Mandatory
    };
  }

  function onTimePick (val) {
    if (typeof (val) === 'undefined') {
      console.log('Time not selected');
    } else {
      $scope.timePickerObject.inputEpochTime = val;
    }
  }

  function initTimePicker () {
    $scope.timePickerObject = {
      inputEpochTime: ((new Date()).getHours() * 60 * 60),  //Optional
      step: 15,  //Optional
      format: 12,  //Optional
      titleLabel: 'Pick a Time',  //Optional
      setLabel: 'Set',  //Optional
      closeLabel: 'Close',  //Optional
      setButtonType: 'button-positive',  //Optional
      closeButtonType: 'button-stable',  //Optional
      callback: onTimePick //Mandatory
    };
  }

  function initLocation () {
    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position) {
        var lat  = position.coords.latitude;
        var lng = position.coords.longitude;
        GoogleMap.setMarkerPosition(lat, lng, {pan: true});
        $scope.wutudu.latitude = lat;
        $scope.wutudu.longitude = lng;
    }, function (err) {
      console.log(err);
      $ionicPopup.alert({
        title: err.message
      });
    });
  }
});
