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
