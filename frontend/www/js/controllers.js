angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
})

.controller('LoginCtrl', function ($scope, $state, $http, $ionicPopup) {
  $scope.loginData = {};

  $scope.doLogin = function() {
    var requestData = {'login' : angular.copy($scope.loginData) };
    requestData.login.password = requestData.login.password.hashString();

    $http({
      method: 'POST',
      headers: {
       'Content-Type': 'application/json'
      },
      data: requestData,
      url: this.$root.SERVER_URL + '/login'
    }).then(function successCallback (response) {
        console.log('Login success: auth token=' + response.data.token);
        $scope.$root.TOKEN = response.data.token;
        $state.go('app.search');
    }, function errorCallback (response) {
        $ionicPopup.alert({
          title: 'Login Error',
          template: response.data.errors
        });
    });
  };
})

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
})

.controller('PlaylistsCtrl', function ($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function ($scope, $stateParams) {
})

.controller('SearchCtrl', function ($scope, $ionicPopup, $http) {
  $scope.getTest = function () {
    $http({
      method: 'GET',
      url: this.$root.SERVER_URL + '/widgets/1'
    }).then(function successCallback (response) {
        console.log(response.data.name);
        var alertPopup = $ionicPopup.alert({
          title: response.data.name,
          template: 'CLICK ME. I KNOW YOU WANT TO!'
        });
        alertPopup.then(function (response) {
          console.log('Button wuz clicked');
        });
    }, function errorCallback (response) {
        console.log('Get error');
    });
  };

  $scope.postTest = function (widget) {
    var formData = angular.copy(widget);
    formData = {'widget' : formData };
    $http({
      method: 'POST',
      headers: {
       'Content-Type': 'application/json'
      },
      data: formData,
      url: this.$root.SERVER_URL + '/widgets'
    }).then(function successCallback (response) {
        console.log('Post success');
    }, function errorCallback (response) {
        console.log('Post error');
    });
  };
});

