angular.module('starter.controllers')

.controller('FriendListCtrl', function ($scope, $ionicPopup,
  $ionicLoading, Friend, ErrorPopup) {

  var data = $scope.data = {
    friendToAdd: ''
  };

  // 0 Friends List
  // 1 Sent Requests List
  // 2 Received Requests List
  $scope.listsShow = [true, true, false];

  $scope.$on('$ionicView.enter', init);

  $scope.toggleList = function(i) {
    $scope.listsShow[i] = !$scope.listsShow[i];
  };

  $scope.doRefresh = function () {
    init();
  };

  $scope.validateNewFriend = function () {
    if (typeof $scope.data.friendToAdd === 'undefined') {
      ErrorPopup.display('Failed To Send Friend Request',
                   'Please enter a valid email.');
      return false;
    } else if ($scope.data.friendToAdd === '') {
      ErrorPopup.display('Failed To Send Friend Request',
                         'Email cannot be blank.');
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
        title: 'Friend Request Success',
        template: 'Friend Request Sent To ' + data.friendToAdd,
        cssClass: 'alert-success'
      });
      $scope.sentRequests.push({ 'name' : response.data.user.name,
                                 'email' : response.data.user.email});
      $scope.data.friendToAdd = '';
    }, function errorCallback (response) {
      $scope.data.friendToAdd = '';
      $scope.response = response;
      ErrorPopup.displayResponse(response.status,
                                 'Add Friend Error',
                                 response.data.errors);
    });
  };

  $scope.acceptFriend = function (friend) {
    Friend.acceptFriendRequest({
      'email': friend.email
    }).then(function successCallback (response) {
      $scope.friends.push({ 'email' : friend.email, 'name': friend.name});
      $scope.receivedRequests = $scope.receivedRequests.filter(function (f) {
        return f.email !== friend.email;
      });
      $ionicPopup.alert({
        title: 'Accept Friend Success',
        template: 'You Are Now Friends With ' + friend.email + '!',
        cssClass: 'alert-success'
      });
    }, function errorCallback (response) {
      $scope.response = response;
      ErrorPopup.displayResponse(response.status,
                                 'Accept Friend Error',
                                 response.data.errors);
    });
  };

  $scope.removeFriend = function (friend, type) {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Remove Friend',
      template: 'Are You Sure You Want To Remove This Friend?'
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
      template: 'Are You Sure You Want To Remove This Friend Invite?'
    });
    confirmPopup.then(function (response) {
      if (response) {
        $scope.doRemoveFriend(friend, 'invite');
      }
    });
  };

  $scope.doRemoveFriend = function (friend, type) {
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
        popupMsg = 'You Are No Longer Friends With ' + friend.email + '!';
      } else if (type == 'invite') {
        $scope.sentRequests = $scope.sentRequests.filter(function (f) {
          return f.email !== friend.email;
        });
        popupMsg = 'Your Friend Invite To ' + friend.email + ' Has Been Cancelled!';
      }
      $ionicPopup.alert({
        title: 'Remove Friend Success',
        template: popupMsg,
        cssClass: 'alert-success'
      });
    }, function errorCallback (response) {
      $scope.response = response;
      ErrorPopup.displayResponse(response.status,
                                 'Remove Friend Error',
                                 response.data.errors);
    });
  };

  function init(e) {
    $ionicLoading.show({
        template: 'Loading...'
    });
    Friend.getFriends().then(getFriendsSuccess, getFriendsError);
  }

  function getFriendsSuccess(response) {
    $scope.friends = response.data.friendships.friends;
    $scope.sentRequests = response.data.friendships.sent_requests;
    $scope.receivedRequests = response.data.friendships.received_requests;
    $ionicLoading.hide();
    $scope.$broadcast('scroll.refreshComplete');
  }

  function getFriendsError(response) {
    $scope.response = response;
    $ionicLoading.hide();
    ErrorPopup.displayResponse(response.status,
                               'Get Friend Error',
                               response.data.errors);
  }
});
