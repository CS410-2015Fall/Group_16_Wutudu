angular.module('starter.controllers', [])

.controller('AppCtrl', function ($scope, $ionicPopup, $http, $state) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.logout = function () {
    console.log('logout token = ' + this.$root.TOKEN);
    $http({
      method: 'DELETE',
      headers: {
       'Content-Type': 'application/json',
       'Authorization' : 'Token token=' + this.$root.TOKEN
      },
      url: this.$root.SERVER_URL + '/logout',
    }).then(function successCallback (response) {
      $state.go('login');
      var alertPopup = $ionicPopup.alert({
        title: 'Successfully logged out'
      });
    }, function errorCallback (response) {
      var templateString = '<p><b>Errors Message:</b> ' + response.data.errors + '</p>'
        + '<p><b>Status:</b> ' + response.status + ' ' + response.statusText + '</p>'
        + '<p><b>Request:</b> ' + response.config.method + ' ' + response.config.url + '</p>'
        + '<p><b>Headers:</b> ' + JSON.stringify(response.config.headers) + '</p>'
        + '<p><b>Data:</b> ' + JSON.stringify(response.config.data) + '</p>';
      $ionicPopup.alert({
        title: 'Error when logging out',
        template: templateString
      });
    });
  }
})

.controller('MainCtrl', function ($scope, $ionicPopup, $http) {
  $scope.getTest = function () {
    $http({
      method: 'GET',
      headers: {
       'Content-Type': 'application/json'
      },
      url: this.$root.SERVER_URL + '/widgets/1',
    }).then(function successCallback (response) {
        var alertPopup = $ionicPopup.alert({
          title: 'GET test success',
          template: response.data.name
        });
    }, function errorCallback (response) {
      var templateString = '<p><b>Errors Message:</b> ' + response.data.errors + '</p>'
        + '<p><b>Status:</b> ' + response.status + ' ' + response.statusText + '</p>'
        + '<p><b>Request:</b> ' + response.config.method + ' ' + response.config.url + '</p>'
        + '<p><b>Headers:</b> ' + JSON.stringify(response.config.headers) + '</p>'
        + '<p><b>Data:</b> ' + JSON.stringify(response.config.data) + '</p>';
      $ionicPopup.alert({
        title: 'GET test error',
        template: templateString
      });
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
      var templateString = '<p><b>Status:</b> ' + response.status + ' ' + response.statusText + '</p>'
        + '<p><b>Request:</b> ' + response.config.method + ' ' + response.config.url + '</p>'
        + '<p><b>Headers:</b> ' + JSON.stringify(response.config.headers) + '</p>'
        + '<p><b>Data:</b> ' + JSON.stringify(response.config.data) + '</p>';
      $ionicPopup.alert({
        title: 'POST test success',
        template: templateString
      });
    }, function errorCallback (response) {
      var templateString = '<p><b>Errors Message:</b> ' + response.data.errors + '</p>'
        + '<p><b>Status:</b> ' + response.status + ' ' + response.statusText + '</p>'
        + '<p><b>Request:</b> ' + response.config.method + ' ' + response.config.url + '</p>'
        + '<p><b>Headers:</b> ' + JSON.stringify(response.config.headers) + '</p>'
        + '<p><b>Data:</b> ' + JSON.stringify(response.config.data) + '</p>';
      $ionicPopup.alert({
        title: 'POST test error',
        template: templateString
      });
    });
  };
});

