angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('SearchCtrl', function($scope, $ionicPopup, $http) {
  $scope.getTest = function () {
      $http({
        method: 'GET',
        url: 'http://localhost:5000/widgets/1'
      }).then(function successCallback (response) {
          // this callback will be called asynchronously
          // when the response is available
          console.log(response.data.name);
          var alertPopup = $ionicPopup.alert({
              title: response.data.name,
              template: 'CLICK ME. I KNOW YOU WANT TO!'
          });
          alertPopup.then(function (response) {
              console.log('Button wuz clicked');
          });
      }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
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
          url: 'http://localhost:5000/widgets'
        }).then(function successCallback (response) {
            // this callback will be called asynchronously
            // when the response is available
            console.log('Post success');
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log('Post error');
        });
    };
});

