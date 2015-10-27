angular.module('starter.controllers')

.controller('SignupCtrl', function ($scope, $state,
  $httpService, $ionicPopup, User, $wutuduNotification) {
  $scope.signupData = {};

  $scope.validateSignup = function () {
    var requestData = {'user' : angular.copy($scope.signupData) };
    var errors = '';
    var fields = ['name', 'email', 'password'];
    for (var i = 0; i < fields.length; i++) {
      if (!requestData.user[fields[i]]) {
        errors = errors.concat('<p>The ' + fields[i] + ' field cannot be blank.</p>');
      }
    }
    if (errors !== '') {
      $ionicPopup.alert({
        title: 'Sign up errors',
        template: errors
      });
    } else {
      requestData.user.password = requestData.user.password.hashString();
      prepareLogin(requestData);
    }
  };

  function prepareLogin(requestData) {
    $wutuduNotification.register().then(function(deviceToken) {
      var config = {
        data: requestData,
        deviceToken: deviceToken
      };
      $scope.doSignup(config);
    });
  }

  $scope.doSignup = function (config) {
    var payload = {
      method: 'POST',
      data: config.data,
      url: '/users',
      headers: {
        "Device-Token": config.deviceToken
      }
    };
    $httpService.makeRequest(payload).then(function successCallback (response) {
      console.log('Create user success: auth token=' + response.data.token);
      $scope.signupData = {}; // Clear form data
      User.setSession(response.data.token, response.data.user);
      $state.go('app.main');
    }, function errorCallback (response) {
      response.config.headers = JSON.stringify(response.config.headers);
      response.config.data = JSON.stringify(response.config.data);
      $scope.response = response;
      $ionicPopup.show({
        title: 'Sign up error',
        templateUrl: 'templates/errorPopup.html',
        scope: $scope,
        buttons: [{ text: 'OK' }]
      });
    });
  };
});
