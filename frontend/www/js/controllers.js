angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
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
      headers: {
       'Content-Type': 'application/json'
      },
      url: this.$root.SERVER_URL + '/widgets/1',
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

