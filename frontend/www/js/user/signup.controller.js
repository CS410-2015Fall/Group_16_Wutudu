angular.module('starter.controllers')

.controller('SignupCtrl', function ($scope, $state, $http, $ionicPopup) {
  $scope.signupData = {};

  $scope.doSignup = function () {
    var requestData = {'user' : angular.copy($scope.signupData) };
    requestData.user.password = requestData.user.password.hashString();

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
        $ionicPopup.alert({
          title: 'Signup Error',
          template: response.data.errors
        });
    });
  };
});
