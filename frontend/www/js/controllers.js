angular.module('starter.controllers', [])

.controller('AppCtrl', function ($scope, $ionicPopup, $httpService, $state, User) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.user = User.getUserInfo();

  $scope.logout = function () {
    console.log('logout token = ' + this.$root.TOKEN);
    var payload = {
      method: 'DELETE',
      url: '/logout'
    };
    $httpService.makeRequest(payload).then(function successCallback (response) {
      User.removeSession();
      $state.go('login');
      var alertPopup = $ionicPopup.alert({
        title: 'Successfully logged out'
      });
    }, function errorCallback (response) {
      response.config.headers = JSON.stringify(response.config.headers);
      response.config.data = JSON.stringify(response.config.data);
      $scope.response = response;
      $ionicPopup.show({
        title: 'Logout Error',
        templateUrl: 'templates/errorPopup.html',
        scope: $scope,
        buttons: [{ text: 'OK' }]
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
      response.config.headers = JSON.stringify(response.config.headers);
      response.config.data = JSON.stringify(response.config.data);
      $scope.response = response;
      $ionicPopup.show({
        title: 'Get Test Error',
        templateUrl: 'templates/errorPopup.html',
        scope: $scope,
        buttons: [{ text: 'OK' }]
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
      response.config.headers = JSON.stringify(response.config.headers);
      response.config.data = JSON.stringify(response.config.data);
      $scope.response = response;
      $ionicPopup.show({
        title: 'Post Test Error',
        templateUrl: 'templates/errorPopup.html',
        scope: $scope,
        buttons: [{ text: 'OK' }]
      });
    });
  };
});

