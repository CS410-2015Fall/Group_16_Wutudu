angular.module('starter.controllers')

.controller('LoginCtrl', function ($scope, $state, $httpService,
  User, $wutuduNotification, $ionicPopup, $ionicLoading, Auth) {
  if (User.getSession()) {
    // TODO check for token validity
    $ionicLoading.show({
      template: 'Loading...'
    });
    $wutuduNotification.register().then(function() {
      $ionicLoading.hide();
      $state.go('app.main');
    });
    return;
  }

  $scope.loginData = {};

  $scope.validateLogin = function () {
    var loginCreds = angular.copy($scope.loginData);
    var errors = '';
    var fields = ['email', 'password'];
    for (var i = 0; i < fields.length; i++) {
      if (!loginCreds[fields[i]]) {
        errors = errors.concat('<p>The ' + fields[i] + ' field cannot be blank.</p>');
      }
    }
    if (errors !== '') {
      $ionicPopup.alert({
        title: 'Login errors',
        template: errors
      });
    } else {
      loginCreds.password = loginCreds.password.hashString();
      prepareLogin(loginCreds);
    }
  };

  function prepareLogin(loginCreds) {
    $ionicLoading.show({
      template: 'Loading...'
    });
    $wutuduNotification.register().then(function(deviceToken) {
      var loginConfig = {
        loginCreds: loginCreds,
        deviceToken: deviceToken
      };
      doLogin(loginConfig);
    });
  }

  function doLogin(loginConfig) {
    Auth.login(loginConfig).then(function successCallback (response) {
      console.log('Login success: auth token=' + response.data.token);
      $scope.loginData = {}; // Clear form data
      User.setSession(response.data.token, response.data.user);
      $ionicLoading.hide();
      $state.go('app.main');
    }, function errorCallback (response) {
      response.config.headers = JSON.stringify(response.config.headers);
      response.config.data = JSON.stringify(response.config.data);
      $scope.response = response;
      $ionicPopup.show({
        title: 'Login Error',
        templateUrl: 'templates/errorPopup.html',
        scope: $scope,
        buttons: [{ text: 'OK' }]
      });
    });
  }
});
