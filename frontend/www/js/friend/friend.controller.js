angular.module('starter.controllers')

.controller('FriendCtrl', function ($scope, $stateParams, $ionicPopup, Friend, Wutudu) {
   var id = $stateParams.friendId;
   // query Friend services with id to find friend object

   $scope.inProgressWutudus = Wutudu.getInProgressWutudus({friendId: id});
   $scope.upcomingWutudus = Wutudu.getInProgressWutudus({friendId: id});


   // TODO refactor show details/question in friend and group
   $scope.showWutuduDetail = function (wutudu) {
     // use wutudu object to show the details
     $ionicPopup.show({
       templateUrl: 'templates/wutudu/detailPage.html',
       title: 'Wutudu',
       buttons: [
         { text: 'Ok', type: 'button-positive'}
       ]
     });
   }

   $scope.showWutuduQuestion = function (question) {
    $scope.questions = Wutudu.getQuestions(question);
    $ionicPopup.show({
       templateUrl: 'templates/wutudu/questionPage.html',
       title: 'Question',
       scope: $scope,
       buttons: [
         { text: 'Ok', type: 'button-positive'}
       ]
     });
   }
 });
