angular.module('starter.controllers')

.controller('GroupListCtrl', function($scope, $ionicPopup, $ionicModal,
  $ionicLoading, $state, $msgBox, Friend, Group) {


  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  $scope.acceptInvitation = function(groupId) {
    var config = {
      groupId: groupId
    };
    Group.addGroup(config)
      .then(addGroupToView, handleError);
  };

  $scope.leaveGroup = function(groupId) {
    var config = {
      groupId: groupId
    };
    Group.removeGroup(config)
      .then(removeGroupFromView, handleError);
  };

  $scope.declineInvitation = function(groupId) {
    $scope.leaveGroup(groupId);
  };

  $scope.showCreateGroup = function() {
    Friend.getFriends()
      .then(setupFriends, handleError);
    $scope.modal.show();
  };

  $scope.createGroup = function() {
    var name = $scope.data.createGroup.name,
        friendEmails = function(friend) {
          return friend.email;
        },
        emails,
        config;

    if(!validateCreateGroup(name)) return;

    emails = $scope.data.friendsInvited.map(friendEmails);
    config = {
      name: name,
      emails: emails
    };

    Group.createGroup(config)
      .then(groupCreated, handleError);
  };

  $scope.addFriendToGroup = function() {
    displayFriendModal();
  };

  $scope.handleAddFriend = function(e) {
    var isFriendInvited = function(friend) {
      return friend.invited;
    };
    $scope.data.friendsInvited = $scope.data.friends.filter(isFriendInvited);
  };

  $scope.cancelCreateGroup = function() {
    $scope.modal.hide();
  };

  function initData() {
    $scope.data = {
      createGroup: {
        name: ''
      },
      friends : [],
      friendsInvited: []
    };
  }

  function initModal() {
    var createGroupTplUrl = 'templates/group/createGroup.html',
      createGroupTplConfig = {
          scope: $scope,
          animation: 'slide-in-up'
      };

    $ionicModal
      .fromTemplateUrl(createGroupTplUrl, createGroupTplConfig)
      .then(setupModal);
  }

  function setupModal(modal) {
      $scope.modal = modal;
  }

  function setupFriends(response) {
    var friends = response.data.friendships.friends;
    $scope.data.friends = friends;
  }

  function setupGroups(response) {
    var groups = response.data.groups;
    $scope.activeGroups = groups.active_groups;
    $scope.pendingGroups = groups.pending_groups;
    $ionicLoading.hide();
  }

  function handleError(response) {
    response.config.headers = JSON.stringify(response.config.headers);
    response.config.data = JSON.stringify(response.config.data);
    $scope.response = response;
    $ionicLoading.hide();
    var data = {
      title: 'Get Group error',
      templateUrl: 'templates/errorPopup.html',
      scope: $scope,
      buttons: [{ text: 'OK' }]
    };
    $ionicPopup.show(data);
  }

  function addGroupToView(response) {
    var data = response.data,
        selectedGroup = function(group) {
          return group.id !== data.group.id;
        };
    $scope.activeGroups.push(data.group);
    $scope.pendingGroups = $scope.pendingGroups.filter(selectedGroup);
  }

  function removeGroupFromView(response) {
    var data = response.data;
    var groupLeft = function(group) {
      return group.id !== data.group.id;
    };
    $scope.activeGroups = $scope.activeGroups.filter(groupLeft);
    $scope.pendingGroups = $scope.pendingGroups.filter(groupLeft);
  }

  function validateCreateGroup(name) {
    if(!name) {
      var msg = {
        title: 'No group name',
        template: '<span>Please specify a group name</span>'
      };
      $msgBox.show($scope, msg);
      return false;
    }
    return true;
  }

  function groupCreated(response) {
    var msg = {
      title: 'Group successfully created',
    };
    $msgBox.show($scope, msg);
    // opportunisitc update
    $scope.activeGroups.push(response.data.group);
    $scope.modal.hide();
  }

  function displayFriendModal() {
    var tplConfig = {
      templateUrl: 'templates/friend/addFriend.html',
      title: 'Add Friend to Group',
      subTitle: 'Please choose your friend to add',
      scope: $scope,
      buttons: [
         { text: 'Add',
           type: 'button-balanced',
           onTap: $scope.handleAddFriend
         },
       { text: 'Cancel', type: 'button-assertive'}
      ]
    };
    $ionicPopup.show(tplConfig);
  }

  (function() {
    initData();
    initModal();

    Group.getAllGroups()
      .then(setupGroups, handleError);

    $ionicLoading.show({
      template: 'Loading...'
    });
  })();

});
