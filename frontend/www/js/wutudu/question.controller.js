angular.module('starter.controllers')

.controller('WutuduQuestionCtrl', function ($scope, $stateParams, $ionicPopup, $timeout, $state, Wutudu, ErrorPopup) {
  var groupId = $stateParams.groupId,
      wutuduId = $stateParams.wutuduId,
      groupName = $stateParams.groupName,
      config = {
        groupId: groupId,
        wutuduId: wutuduId,
        groupName: groupName
      };

  $scope.preWutudu = $stateParams.preWutudu;
  $scope.currentQuestion = 0;
  $scope.questions = null;
  $scope.disabledSubmit = true;
  $scope.answers = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1];

  (function init () {
    if (!$scope.preWutudu) {
      $state.go('app.group', config);
      // TODO it would be better if we can just reload the questions
      // reloadQuestions();
      return;
    } else {
      $scope.questions = $stateParams.preWutudu.questions;
    }
  })();

  $scope.slideHasChanged = function (index) {
    console.log('current question is: ' + index);
    $scope.currentQuestion = index;
    checkAllAnswered();
    updateButtonStyles(index);
  };


  $scope.jumpToQuestion = function (index) {
    console.log('current question is: ' + index);
    $scope.currentQuestion = index;
  };

  $scope.answerQuestion = function (answer, question) {
    console.log('Question: ' + $scope.currentQuestion + ' / Answer: ' + answer);
    $scope.answers[$scope.currentQuestion] = answer;
    checkAllAnswered();
    if ($scope.currentQuestion < 9) {
      $scope.currentQuestion++; // Go to next slide
    } else {
      updateButtonStyles($scope.currentQuestion);
    }
  };

  $scope.submitAnswers = function () {
    if ($scope.answers.indexOf(-1) !== -1) {
      ErrorPopup.display('Submit Answer Error',
                         'Some Questions Are Not Answered!');
      return;
    }
    var options = angular.copy(config);
    options.data = {'user_answer' : {
      'answers': $scope.answers
    }};
    Wutudu.sendAnswers(options).then(function (response) {
      $state.go('app.group', config);
    }, function (response) {
      $scope.response = response;
      ErrorPopup.displayResponse(response.status,
                                 'Submit Answer Error',
                                 response.data.errors);
    });
  };

  $scope.cancelAnswers = function () {
    $state.go('app.group', config);
  }

  function checkAllAnswered () {
    if ($scope.answers.indexOf(-1) === -1) {
      $scope.disabledSubmit = false;
    }
  }

  function updateButtonStyles (index) {
    // Clear all button styles
    $scope.answerStyle0 = 'button';
    $scope.answerStyle1 = 'button';
    $scope.answerStyle2 = 'button';
    $scope.answerStyle3 = 'button';
    // Color button according to answer
    switch ($scope.answers[index]) {
      case 0:
        $scope.answerStyle0 = 'button button-balanced';
        break;
      case 1:
        $scope.answerStyle1 = 'button button-balanced';
        break;
      case 2:
        $scope.answerStyle2 = 'button button-balanced';
        break;
      case 3:
        $scope.answerStyle3 = 'button button-balanced';
        break;
    }
  }

  function reloadQuestions () {
    Wutudu.getInProgressWutudu(config).then(function (response) {
      $scope.preWutudu = response.data.pre_wutudu;
      $scope.questions = response.data.pre_wutudu.questions;
      $timeout(function() {
        $scope.$apply();
      });
    }, function (response) {
      $scope.response = response;
      ErrorPopup.displayResponse(response.status,
                                 'Reload Questions Error',
                                 response.data.errors);
    });
  }
});
