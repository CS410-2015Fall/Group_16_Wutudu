angular.module('starter.controllers', [])

.controller('AppCtrl', function ($scope, $ionicPopup,
  $httpService, $state, User, Auth) {

  $scope.$on('$ionicView.enter', init);

  $scope.logout = function () {
    Auth.logout()
      .then(logoutSuccess, handleError);
  };

  function init() {
    $scope.user = User.getUserInfo();
  }

  function logoutSuccess(response) {
    User.removeSession();
    $state.go('login');
    $ionicPopup.alert({
      title: 'Successfully logged out'
    });
  }

  function handleError(response) {
    response.config.headers = JSON.stringify(response.config.headers);
    response.config.data = JSON.stringify(response.config.data);
    $scope.response = response;
    $ionicPopup.show({
      title: 'Logout Error',
      templateUrl: 'templates/errorPopup.html',
      scope: $scope,
      buttons: [{ text: 'OK' }]
    });
  }
})

.controller('MainCtrl', function () {
});


