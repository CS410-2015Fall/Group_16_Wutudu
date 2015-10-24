angular.module('starter.controllers')

.controller('LoginCtrl', function ($scope, $state, $httpService, $ionicPopup, User) {
  if(User.getSession()) {
    $state.go('app.main');
  }

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
    var payload = {
      method: 'POST',
      data: requestData,
      url: '/login'
    };
    $httpService.makeRequest(payload).then(function successCallback (response) {
      console.log('Login success: auth token=' + response.data.token);
      $scope.loginData = {}; // Clear form data
      $scope.$root.TOKEN = response.data.token;
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
