angular.module('starter.controllers')

.controller('SignupCtrl', function ($scope, $state, $ionicPopup,
  User, $wutuduNotification, Auth, ErrorPopup) {
  $scope.signupData = {};

  $scope.validateSignup = function () {
    var userData = angular.copy($scope.signupData);
    var errors = validateFields(userData);
    if (errors) {
      ErrorPopup.display('Signup Errors', errors);
    } else {
      userData.email = userData.email;
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
    console.log('Create User Success: auth token=' + response.data.token);
    $scope.signupData = {}; // Clear form data
    User.setSession(response.data.token, response.data.user);
    $state.go('app.main');
  }

  function signUpError(response) {
    $scope.response = response;
    ErrorPopup.displayResponse(response.status,
                               'Signup Error',
                               response.data.errors);
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
        error += 'The ' + field + ' Field Cannot Be Blank.\n';
      }
      return error;
    }, '');

    if(!emailRegex.test(userData.email)) {
      emailError += 'Please Sign Up With A Valid Email.\n';
    }
    return emptyFieldError + emailError;
  }
});
