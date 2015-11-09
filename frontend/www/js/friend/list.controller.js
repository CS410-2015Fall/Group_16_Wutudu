angular.module('starter.controllers')

.controller('FriendListCtrl', function ($scope, $ionicPopup,
  $ionicLoading, Friend) {

  var data = $scope.data = {
    friendToAdd: ''
  };

  $ionicLoading.show({
      template: 'Loading...'
  });
  // Gets called each time tab is open
  Friend.getFriends().then(function successCallback (response) {
    console.log('Get friends success');
    $scope.friends = response.data.friendships.friends;
    $scope.sentRequests = response.data.friendships.sent_requests;
    $scope.receivedRequests = response.data.friendships.received_requests;
    $ionicLoading.hide();
  }, function errorCallback (response) {
    $ionicLoading.hide();
    response.config.headers = JSON.stringify(response.config.headers);
    response.config.data = JSON.stringify(response.config.data);
    $scope.response = response;
    $ionicPopup.show({
      title: 'Get friend error',
      templateUrl: 'templates/errorPopup.html',
      scope: $scope,
      buttons: [{ text: 'OK' }]
    });
  });

  $scope.validateNewFriend = function () {
    if ($scope.data.friendToAdd === '') {
      $ionicPopup.alert({
        title: 'Failed to send friend request',
        template: 'The email cannot be blank.'
      });
      return false;
    }
    return true;
  };

  $scope.addFriend = function () {
    if (!this.validateNewFriend()) {
      return;
    }
    Friend.sendFriendRequest({
      'email': data.friendToAdd
    }).then(function successCallback (response) {
      $ionicPopup.alert({
        title: 'Friend Request Sent!'
      });
      $scope.sentRequests.push({ 'email' : $scope.data.friendToAdd });
      $scope.data.friendToAdd = '';
    }, function errorCallback (response) {
      $scope.data.friendToAdd = '';
      response.config.headers = JSON.stringify(response.config.headers);
      response.config.data = JSON.stringify(response.config.data);
      $scope.response = response;
      $ionicPopup.show({
        title: 'Add friend error',
        templateUrl: 'templates/errorPopup.html',
        scope: $scope,
        buttons: [{ text: 'OK' }]
      });
    });
  };

  $scope.acceptFriend = function (friend) {
    console.log('acceptFriend');
    Friend.acceptFriendRequest({
      'email': friend.email
    }).then(function successCallback (response) {
      $scope.friends.push({ 'email' : friend.email });
      $scope.receivedRequests = $scope.receivedRequests.filter(function (f) {
        return f.email !== friend.email;
      });
      $ionicPopup.alert({
        title: 'You are now friends with ' + friend.email + '!'
      });
    }, function errorCallback (response) {
      response.config.headers = JSON.stringify(response.config.headers);
      response.config.data = JSON.stringify(response.config.data);
      $scope.response = response;
      $ionicPopup.show({
        title: 'Accept friend error',
        templateUrl: 'templates/errorPopup.html',
        scope: $scope,
        buttons: [{ text: 'OK' }]
      });
    });
  };

  $scope.removeFriend = function (friend, type) {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Remove Friend',
      template: 'Are you sure you want to remove this friend?'
    });
    confirmPopup.then(function (response) {
      if (response) {
        $scope.doRemoveFriend(friend, 'remove');
      }
    });
  };

  $scope.cancelInvite = function (friend) {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Cancel Friend Invite',
      template: 'Are you sure you want to remove this friend invite?'
    });
    confirmPopup.then(function (response) {
      if (response) {
        $scope.doRemoveFriend(friend, 'invite');
      }
    });
  };

  $scope.doRemoveFriend = function (friend, type) {
    console.log('removeFriend');
    Friend.removeFriend({
      'email': friend.email
    }).then(function successCallback (response) {
      var popupMsg;
      if (type === 'remove') {
        $scope.friends = $scope.friends.filter(function (f) {
          return f.email !== friend.email;
        });
        $scope.receivedRequests = $scope.receivedRequests.filter(function (f) {
          return f.email !== friend.email;
        });
        popupMsg = 'You are no longer friends with ' + friend.email + '!';
      } else if (type == 'invite') {
        $scope.sentRequests = $scope.sentRequests.filter(function (f) {
          return f.email !== friend.email;
        });
        popupMsg = 'Your friend invite to ' + friend.email + ' has been cancelled!';
      }
      $ionicPopup.alert({
        title: popupMsg
      });
    }, function errorCallback (response) {
      response.config.headers = JSON.stringify(response.config.headers);
      response.config.data = JSON.stringify(response.config.data);
      $scope.response = response;
      $ionicPopup.show({
        title: 'Remove friend error',
        templateUrl: 'templates/errorPopup.html',
        scope: $scope,
        buttons: [{ text: 'OK' }]
      });
    });
  };
});
