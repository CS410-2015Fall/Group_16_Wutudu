angular.module('starter.controllers')

.controller('LoginCtrl', function ($scope, $state, $http, $ionicPopup) {
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
      this.doLogin(requestData)
    }
  };

  $scope.doLogin = function (requestData) {
    $http({
      method: 'POST',
      headers: {
       'Content-Type': 'application/json'
      },
      data: requestData,
      url: this.$root.SERVER_URL + '/login'
    }).then(function successCallback (response) {
      console.log('Login success: auth token=' + response.data.token);
      $scope.loginData = {}; // Clear form data
      $scope.$root.TOKEN = response.data.token;
      $state.go('app.main');
    }, function errorCallback (response) {
      var templateString = '<p><b>Errors Message:</b> ' + response.data.errors + '</p>'
        + '<p><b>Status:</b> ' + response.status + ' ' + response.statusText + '</p>'
        + '<p><b>Request:</b> ' + response.config.method + ' ' + response.config.url + '</p>'
        + '<p><b>Headers:</b> ' + JSON.stringify(response.config.headers) + '</p>'
        + '<p><b>Data:</b> ' + JSON.stringify(response.config.data) + '</p>';
      $ionicPopup.alert({
        title: 'Login Error',
        template: templateString
      });
    });
  };

  $scope.loginBackdoor = function() {
    $state.go('app.search');
  };
});
