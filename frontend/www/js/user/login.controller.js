angular.module('starter.controllers')

.controller('LoginCtrl', function ($scope, $state, $httpService, $ionicPopup,
  User, $wutuduNotification) {
  // if (User.getSession()) {
  //   $state.go('app.main');
  // }

  $scope.loginData = {};

  $scope.validateLogin = function () {
    var requestData = {'login' : angular.copy($scope.loginData) };
    var errors = '';
    var fields = ['email', 'password'];
    for (var i = 0; i < fields.length; i++) {
      if (!requestData.login[fields[i]]) {
        errors = errors.concat('<p>The ' + fields[i] + ' field cannot be blank.</p>');
      }
    }
    if (errors !== '') {
      $ionicPopup.alert({
        title: 'Login errors',
        template: errors
      });
    } else {
      requestData.login.password = requestData.login.password.hashString();
      prepareLogin(requestData);
    }
  };

  function prepareLogin(requestData) {
    $wutuduNotification.register().then(function(deviceToken) {
      var config = {
        data: requestData,
        deviceToken: deviceToken
      };
      $scope.doLogin(config);
    });
  }

  $scope.doLogin = function (config) {
    var payload = {
      method: 'POST',
      data: config.data,
      url: '/login',
      headers: {
        "Device-Token": config.deviceToken
      }
    };
    $httpService.makeRequest(payload).then(function successCallback (response) {
      console.log('Login success: auth token=' + response.data.token);
      $scope.loginData = {}; // Clear form data
      User.setSession(response.data.token, response.data.user);
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
  };

  $scope.loginBackdoor = function() {
    $state.go('app.search');
  };
});
