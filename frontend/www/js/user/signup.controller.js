angular.module('starter.controllers')

.controller('SignupCtrl', function ($scope, $state, $http, $ionicPopup) {
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
      this.doSignup(requestData)
    }
  };

  $scope.doSignup = function (requestData) {
    $http({
      method: 'POST',
      headers: {
       'Content-Type': 'application/json'
      },
      data: requestData,
      url: this.$root.SERVER_URL + '/users'
    }).then(function successCallback (response) {
      console.log('Create user success: auth token=' + response.data.token);
      $scope.$root.TOKEN = response.data.token;
      $state.go('app.search');
    }, function errorCallback (response) {
      var templateString = '<p><b>Errors Message:</b> ' + response.data.errors + '</p>'
        + '<p><b>Status:</b> ' + response.status + ' ' + response.statusText + '</p>'
        + '<p><b>Request:</b> ' + response.config.method + ' ' + response.config.url + '</p>'
        + '<p><b>Headers:</b> ' + JSON.stringify(response.config.headers) + '</p>'
        + '<p><b>Data:</b> ' + JSON.stringify(response.config.data) + '</p>';
      $ionicPopup.alert({
        title: 'Signup Error',
        template: templateString
      });
    });
  };
});
