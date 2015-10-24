angular.module('starter.controllers')

.controller('GroupListCtrl', function($scope, $ionicPopup, $ionicModal, $state,
      $msgBox, Friend, Group) {

    var createGroupTplUrl = 'templates/group/createGroup.html',
      createGroupTplConfig = {
          scope: $scope,
          animation: 'slide-in-up'
      };

  Group.getAllGroups()
                .then(setupGroups, handleError);

  $ionicModal
    .fromTemplateUrl(createGroupTplUrl, createGroupTplConfig)
    .then(setupModal);

  function setupFriends(response) {
    var friends = response.data.friendships.friends;
    $scope.data.friends = friends;
  }

  function setupGroups(response) {
    var groups = response.data.groups;
    $scope.activeGroups = groups.active_groups;
    $scope.pendingGroups = groups.pending_groups;
  }

  function setupModal(modal) {
      $scope.modal = modal;
  }

  function handleError(response) {
    response.config.headers = JSON.stringify(response.config.headers);
    response.config.data = JSON.stringify(response.config.data);
    $scope.response = response;
    var data = {
      title: 'Get Group error',
      templateUrl: 'templates/errorPopup.html',
      scope: $scope,
      buttons: [{ text: 'OK' }]
    };
    $ionicPopup.show(data);
  }

  $scope.acceptInvitation = function(groupId) {
    var config = {
      groupId: groupId
    };
    Group.addGroup(config)
      .then(addGroupToView, handleError);
  };

  function addGroupToView(response) {
    var data = response.data,
        msg = {
          title: 'Join group',
          template: '<span>' + JSON.stringify(data) + '</span>'
        };
    $msgBox.show($scope, msg);
    var selectedGroup = function(group) {
      return group.id !== data.group.id;
    };
    $scope.activeGroups.push(data.group);
    $scope.pendingGroups = $scope.pendingGroups.filter(selectedGroup);
  }

  $scope.leaveGroup = function(groupId) {
    var config = {
      groupId: groupId
    };
    Group.removeGroup(config)
      .then(removeGroupFromView, handleError);
  };

  function removeGroupFromView(response) {
    var data = response.data,
        msg = {
          title: 'Left/Decline group',
          template: '<span>' + JSON.stringify(data) + '</span>'
        };
    $msgBox.show($scope, msg);
    var groupLeft = function(group) {
      return group.id !== data.group.id;
    };
    $scope.activeGroups = $scope.activeGroups.filter(groupLeft);
    $scope.pendingGroups = $scope.pendingGroups.filter(groupLeft);
  }

  $scope.declineInvitation = function(groupId) {
    $scope.leaveGroup(groupId);
  };

  $scope.showCreateGroup = function() {
    $scope.data = {
      createGroup: {
        name: ''
      },
      friends : [],
      friendsInvited: []
    };
    Friend.getFriends()
      .then(setupFriends, handleError);
    $scope.modal.show();
  };

  $scope.cancelCreateGroup = function() {
    $scope.modal.hide();
  };

  $scope.createGroup = function() {
    var name = $scope.data.createGroup.name,
        friendEmails = function(friend) {
          return friend.email;
        },
        emails = $scope.data.friendsInvited.map(friendEmails),
        config;

    if(!validateCreateGroup(name)) return;

    config = {
      name: name,
      emails: emails
    };

    Group.createGroup(config)
      .then(groupCreated, handleError);
  };

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
      template: '<span>' + JSON.stringify(response.data) + '</span>'
    };
    $msgBox.show($scope, msg);
    // opportunisitc update
    $scope.activeGroups.push(response.data.group);
    $scope.modal.hide();
  }

  $scope.goToFriend = function(friendId) {
    $state.go('app.friend', {friendId: friendId});
    $scope.cancelCreateGroup();
  };

  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
    console.log('modal hidden');
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
    console.log('modal removed');
  });

  $scope.addFriendToGroup = function() {
    var isFriendInvited = function(friend) {
          return friend.invited;
        },
        handleAddFriend = function(e) {
          $scope.data.friendsInvited = $scope.data.friends.filter(isFriendInvited);
          console.debug('Adding friend to group');
        },
        addFriendTplConfig = Friend.addFriendTplConfig($scope, handleAddFriend);
    $ionicPopup.show(addFriendTplConfig);
  };

});
