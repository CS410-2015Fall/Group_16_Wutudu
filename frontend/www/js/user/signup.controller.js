angular.module('starter.controllers')

.controller('SignupCtrl', function ($scope, $state, $ionicPopup,
  User, $wutuduNotification, Auth) {
  $scope.signupData = {};

  $scope.validateSignup = function () {
    var userData = angular.copy($scope.signupData);
    var errors = validateFields(userData);
    if (errors) {
      $ionicPopup.alert({
        title: 'Sign up errors',
        template: errors
      });
    } else {
      userData.password = userData.password.hashString();
      prepareLogin(userData);
    }
  };

  $scope.doSignup = function (config) {
    Auth.signup(config).then(signUpSuccess, signUpError);
  };

  function prepareLogin(userData) {
    $wutuduNotification.register().then(function(deviceToken) {
      var config = {
        user: userData,
        deviceToken: deviceToken
      };
      $scope.doSignup(config);
    });
  }

  function signUpSuccess(response) {
    console.log('Create user success: auth token=' + response.data.token);
    $scope.signupData = {}; // Clear form data
    User.setSession(response.data.token, response.data.user);
    $state.go('app.main');
  }

  function signUpError(response) {
    response.config.headers = JSON.stringify(response.config.headers);
    response.config.data = JSON.stringify(response.config.data);
    $scope.response = response;
    $ionicPopup.show({
      title: 'Sign up error',
      templateUrl: 'templates/errorPopup.html',
      scope: $scope,
      buttons: [{ text: 'OK' }]
    });
  }

  function validateFields(userData) {
    var fields = ['name', 'email', 'password'].map(function(field) {
          return userData[field];
        }),
        emailRegex = /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])/i,
        emptyFieldError = '',
        emailError = '';

    emptyFieldError += fields.reduce(function (error, field) {
      if (!field) {
        error += '<p>The ' + field + ' field cannot be blank.</p>';
      }
      return error;
    }, '');

    if(!emailRegex.test(userData.email)) {
      emailError += '<p>Please sign up with a valid email.</p>';
    }
    return emptyFieldError + emailError;
  }
});
