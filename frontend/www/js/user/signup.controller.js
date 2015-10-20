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
      $scope.signupData = {}; // Clear form data
      $scope.$root.TOKEN = response.data.token;
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
