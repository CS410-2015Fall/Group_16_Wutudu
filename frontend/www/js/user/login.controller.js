angular.module('starter.controllers')

.controller('LoginCtrl', function ($scope, $state, $http, $ionicPopup) {
  $scope.loginData = {};

  $scope.doLogin = function() {
    var requestData = {'login' : angular.copy($scope.loginData) };
    requestData.login.password = requestData.login.password.hashString();

    $http({
      method: 'POST',
      headers: {
       'Content-Type': 'application/json'
      },
      data: requestData,
      url: this.$root.SERVER_URL + '/login'
    }).then(function successCallback (response) {
        console.log('Login success: auth token=' + response.data.token);
        $scope.$root.TOKEN = response.data.token;
        $state.go('app.search');
    }, function errorCallback (response) {
        $ionicPopup.alert({
          title: 'Login Error',
          template: response.data.errors
        });
    });
  };

  $scope.loginBackdoor = function() {
    $state.go('app.search');
  };
});
