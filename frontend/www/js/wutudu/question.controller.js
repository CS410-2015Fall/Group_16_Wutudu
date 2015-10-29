angular.module('starter.controllers')

.controller('WutuduQuestionCtrl', function ($scope, $stateParams, $ionicPopup, $timeout, Wutudu) {
  var groupId = $stateParams.groupId,
      wutuduId = $stateParams.wutuduId,
      config = {
        groupId: groupId,
        wutuduId: wutuduId
      };

  $scope.preWutudu = $stateParams.preWutudu;
  $scope.currentQuestion = 0;
  $scope.questions = null;
  $scope.answers = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1];

  (function init () {
    if (!$scope.preWutudu) {
      reloadQuestions();
    } else {
      $scope.questions = $stateParams.preWutudu.questions;
    }
  })();

  $scope.slideHasChanged = function (index) {
    console.log('current question is: ' + index);
    $scope.currentQuestion = index;
    if ($scope.answers[index] !== -1) {
      // Color button according to answer
    }
  };

  $scope.jumpToQuestion = function (index) {
    $scope.currentQuestion = index;
  };

  $scope.answerQuestion = function (answer, question) {
    console.log('Question: ' + $scope.currentQuestion + ' / Answer: ' + answer);
    $scope.answers[$scope.currentQuestion] = answer;
    if ($scope.currentQuestion < 9) {
      $scope.currentQuestion++; // Go to next slide
    }
  };

  $scope.submitAnswers = function () {
    if ($scope.answers.indexOf(-1) !== -1) {
      $ionicPopup.alert({
        title: 'Some questions are not answered!',
      });
      return;
    }
  };

  $scope.declineWutudu = function () {
    console.log('Declined Wutudu');
  };

  function reloadQuestions () {
    Wutudu.getInProgressWutudu(config).then(function (response) {
      $scope.preWutudu = response.data.pre_wutudu;
      $scope.questions = response.data.pre_wutudu.questions;
      $timeout(function() {
        $scope.$apply();
      })
    }, function (response) {
      response.config.headers = JSON.stringify(response.config.headers);
      response.config.data = JSON.stringify(response.config.data);
      $scope.response = response;
      $ionicPopup.show({
        title: 'Failed to reload questions',
        templateUrl: 'templates/errorPopup.html',
        scope: $scope,
        buttons: [{ text: 'OK' }]
      });
    });
  };
});
