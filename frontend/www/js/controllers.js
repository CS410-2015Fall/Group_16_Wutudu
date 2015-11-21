angular.module('starter.controllers', [])

.controller('AppCtrl', function ($scope, $ionicPopup,
  $httpService, $ionicHistory, $state, User, Auth, ErrorPopup) {

  $scope.$on('$ionicView.enter', init);

  $scope.logout = function () {
    Auth.logout()
      .then(logoutSuccess, handleError);
  };

  $scope.customBackClick = function () {
    var historyId = $ionicHistory.backView().historyId;
    historyId = (historyId) ? historyId : 'ion1';
    var viewHistory = $ionicHistory.viewHistory();
    if (!viewHistory.histories[historyId]) {
      // Default back button functionality
      $ionicHistory.goBack();
    } else {
      // Go back to the hamburger
      $ionicHistory.goToHistoryRoot(historyId);
    }
  };

  function init() {
    $scope.user = User.getUserInfo();
  }

  function logoutSuccess(response) {
    User.removeSession();
    $state.go('login');
    $ionicPopup.alert({
      title: 'Message',
      template: 'Successfully Logged Out',
      cssClass: 'alert-success'
    });
  }

  function handleError(response) {
    $scope.response = response;
    ErrorPopup.displayResponse(response.status,
                               'Logout Error',
                               response.data.errors);
  }
})

.controller('MainCtrl', function () {
});


