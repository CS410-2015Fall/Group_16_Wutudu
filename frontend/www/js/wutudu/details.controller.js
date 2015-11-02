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
    $scope.wutudu.event_details = $scope.wutudu.event_details || {};
    initMap() 
  })();

  function initMap () {
    if (!google.maps.Map) {
      console.log('MAP NOT LOADED');
      setTimeout(initMap, 1000);
      return false;
    } else {
      var wut = $scope.wutudu;
      var lat = wut.event_details.location.lat || parseFloat(wut.latitude),
          lng = wut.event_details.location.long || parseFloat(wut.longitude);
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

  $scope.displayRating = function () {
    var wut = $scope.wutudu;
    if (!wut) {
      return '';
    }
    var ratings = wut.event_details.rating || {rating: 0, count:0};
    return ratings.value + ' (' + ratings.count + ' votes)';
  };

  $scope.eventType = function () {
    var wut = $scope.wutudu;
    if (!wut) {
      return '';
    }
    return wut.event_details.categories || '';
  };

});
