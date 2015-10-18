angular.module('starter.controllers')

.controller('FriendListCtrl', function($scope, $ionicPopup, Friend) {

  var data = $scope.data = {
    showDelete: false, //TODO figure out how to show delete
    friendToAdd: ''
  };

  $scope.friends = Friend.getFriends();

  $scope.addFriend = function() {
    console.log('addFriend', data.friendToAdd);
    data.friendToAdd = '';
  };

  $scope.removeFriend = function() {
    console.log('removeFriend');
  }

});
