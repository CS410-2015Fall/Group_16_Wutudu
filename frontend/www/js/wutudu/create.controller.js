angular.module('starter.controllers')

.controller('WutuduCreateCtrl', function($scope, $stateParams, $state,
         $ionicPopup, $ionicModal, $msgBox, Friend, Group, Wutudu) {
  var groupId = $stateParams.groupId,
      config = {
        groupId: groupId
      },
      map,
      marker;

  $scope.wutudu = {
    latitude: 49.2827,
    longitude: -123.1207,
  };

  (function init () {
      initMap();
      initDatePicker();
  })();

  $scope.locationChange = function (wutudu) {
    marker.setPosition({
      lat: parseFloat(wutudu.latitude), 
      lng: parseFloat(wutudu.longitude)
    });
    map.panTo(marker.getPosition());
  };

  $scope.cancelClick = function () {
    $state.go('app.group', config);
  };

  $scope.createWutudu = function (wutudu) {
    // if (!validateCreate(wutudu)) {
    //   return;
    // }
    wutudu.event_date = $scope.datepickerObject.inputDate.toJSON();
    var createConfig = {
      groupId: config.groupId,
      data: {'pre_wutudu' : {
        'event_date' : wutudu.event_date,
        'latitude' : wutudu.latitude,
        'longitude' : wutudu.longitude
      }}
    };
    Wutudu.createWutudu(createConfig)
    .then(function successCallback (response) {
      $ionicPopup.alert({
        title: 'Successfully create wutudu'
      });
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

  function validateCreate (wutudu)  {
    if (!wutudu.name) {
      $ionicPopup.alert({
        title: 'Failed to create Wutudu',
        template: 'The event name cannot be blank.'
      });
      return false;
    }
    return true;
  };

  function setLocation (event) {
    marker.setPosition(event.latLng);
    $scope.wutudu.latitude = event.latLng.lat();
    $scope.wutudu.longitude = event.latLng.lng();
    $scope.$apply();
  };

  function initMap () {
    if (!google.maps.Map) {
      console.log('MAP NOT LOADED');
      setTimeout(initMap, 1000);
    } else {
      map = new google.maps.Map(document.getElementById('createWutuduMap'), {
        center: {lat: 49.2827, lng: -123.1207},
        zoom: 15
      });
      map.addListener('click', setLocation);
      marker = new google.maps.Marker({
        position: {lat: 49.2827, lng: -123.1207},
        map: map,
        title: 'This location'
      });
    }
  };

  function onDatePick (val) {
    if (typeof(val) === 'undefined') {
      console.log('No date selected');
    } else {
      $scope.datepickerObject.inputDate = val;
    }
  };

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
});
