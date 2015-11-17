angular.module('starter.controllers')

.controller('WutuduDetailsCtrl', function($scope, $stateParams, $state,
  $ionicPopup, GoogleMap, $cordovaInAppBrowser) {

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
    var lat = wut.event_details.location.lat || parseFloat(wut.latitude),
        lng = wut.event_details.location.long || parseFloat(wut.longitude);
    GoogleMap.initMap(document.getElementById('wutuduDetailMap'), lat, lng);
  })();

  function formatWutudu(wutudu) {
      var eventDate = new Date(wutudu.event_time),
          stringDate = eventDate.toString();
      stringDate = stringDate.substring(0, stringDate.indexOf(eventDate.toTimeString()));
      wutudu.display_date = stringDate;
    return wutudu;
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

});
