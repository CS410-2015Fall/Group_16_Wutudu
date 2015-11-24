angular.module('starter.controllers')

.controller('LoginCtrl', function ($scope, $state, $httpService,
  User, $wutuduNotification, $ionicLoading, Auth, ErrorPopup) {

  $scope.$on('$ionicView.enter', init);

  $scope.loginData = {};

  $scope.validateLogin = function () {
    var loginCreds = angular.copy($scope.loginData);
    var errors = '';
    var fields = ['email', 'password'];
    for (var i = 0; i < fields.length; i++) {
      if (!loginCreds[fields[i]]) {
        errors = errors.concat('<p>The ' + fields[i] + ' Field Cannot Be Blank.</p>');
      }
    }
    if (errors !== '') {
      ErrorPopup.display('Login Errors', errors);
    } else {
      loginCreds.email = loginCreds.email;
      loginCreds.password = loginCreds.password.hashString();
      prepareLogin(loginCreds);
    }
  };

  function init(e) {
    if (User.getSession()) {
      resumeSession();
    }
  }

  function resumeSession() {
    // TODO check for token validity
    $ionicLoading.show({
      template: 'Loading...'
    });
    $wutuduNotification.register().then(function() {
      $ionicLoading.hide();
      $state.go('app.main');
    });
  }

  function prepareLogin(loginCreds) {
    $ionicLoading.show({
      template: 'Loading...'
    });
    // $wutuduNotification.register().then(function(deviceToken) {
      var loginConfig = {
        loginCreds: loginCreds,
        // deviceToken: deviceToken
        deviceToken: 1
      };
      doLogin(loginConfig);
    // });
  }

  function doLogin(loginConfig) {
    Auth.login(loginConfig).then(loginSuccess, loginError);
  }

  function loginSuccess(response) {
    console.log('Login Success: auth token=' + response.data.token);
    $scope.loginData = {}; // Clear form data
    User.setSession(response.data.token, response.data.user);
    $ionicLoading.hide();
    $state.go('app.main');
  }

  function loginError(response) {
    $ionicLoading.hide();
    ErrorPopup.displayResponse(response.status,
                               'Login Error',
                               response.data.errors);
  }
});
