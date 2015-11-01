angular.module('starter.controllers')

.controller('WutuduDetailsCtrl', function($scope, $stateParams, $state, $ionicPopup) {
  var groupId = $stateParams.groupId,
      wutuduId = $stateParams.wutuduId,
      config = {
        groupId: groupId,
        wutuduId: wutuduId
      },
      map,
      marker;

  (function init () {
    if (!$stateParams.wutudu) {
      $state.go('app.group', config);
      return;
    }
    $scope.wutudu = $stateParams.wutudu;
    initMap() 
  })();

  function initMap () {
    if (!google.maps.Map) {
      console.log('MAP NOT LOADED');
      setTimeout(initMap, 1000);
      return false;
    } else {
      var wut = $scope.wutudu;
      var lat = parseFloat(wut.latitude),
          lng = parseFloat(wut.longitude);
      map = new google.maps.Map(document.getElementById('wutuduDetailMap'), {
        center: {lat: lat, lng: lng},
        zoom: 15
      });
      marker = new google.maps.Marker({
        position: {lat: lat, lng: lng},
        map: map,
        title: 'This location'
      });
      return true;
    }
  }

});
