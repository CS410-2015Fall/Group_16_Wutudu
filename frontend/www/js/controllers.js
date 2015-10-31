angular.module('starter.controllers', [])

.controller('AppCtrl', function ($scope, $ionicPopup,
  $httpService, $state, User) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.user = User.getUserInfo();

  $scope.logout = function () {
    console.log('logout token = ' + this.$root.TOKEN);
    var payload = {
      method: 'DELETE',
      url: '/logout'
    };
    $httpService.makeRequest(payload).then(function successCallback (response) {
      User.removeSession();
      $state.go('login');
      var alertPopup = $ionicPopup.alert({
        title: 'Successfully logged out'
      });
    }, function errorCallback (response) {
      response.config.headers = JSON.stringify(response.config.headers);
      response.config.data = JSON.stringify(response.config.data);
      $scope.response = response;
      $ionicPopup.show({
        title: 'Logout Error',
        templateUrl: 'templates/errorPopup.html',
        scope: $scope,
        buttons: [{ text: 'OK' }]
      });
    });
  };
})

.controller('MainCtrl', function ($scope) {
});

