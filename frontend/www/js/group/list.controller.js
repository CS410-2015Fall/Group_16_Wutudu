angular.module('starter.controllers')

.controller('GroupListCtrl', function($scope, $ionicPopup, $ionicModal,
  $ionicLoading, $state, Friend, Group, ErrorPopup) {

  // 0 Active Groups
  // 1 Group invitation
  $scope.listsShow = [true, true]

  $scope.$on('$ionicView.enter', init);

  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  $scope.toggleList = function(i) {
    $scope.listsShow[i] = !$scope.listsShow[i];
  };

  $scope.doRefresh = function () {
    init();
  };

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

    $scope.handleAddFriend();
    emails = $scope.data.friendsInvited.map(friendEmails);
    config = {
      name: name,
      emails: emails
    };

    Group.createGroup(config)
      .then(groupCreated, handleError);
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
    $scope.$broadcast('scroll.refreshComplete');
  }

  function handleError(response) {
    $scope.response = response;
    $ionicLoading.hide();
    ErrorPopup.displayResponse(response.status,
                               'Group Error',
                               response.data.errors);
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
    $ionicPopup.alert({
      title: 'Left Group Successfully',
      cssClass: 'alert-success'
    });
  }

  function validateCreateGroup(name) {
    if(!name) {
      ErrorPopup.display('No Group Name',
                         'Please Specify A Group Name');
      return false;
    }
    return true;
  }

  function groupCreated(response) {
    // opportunisitc update
    $scope.activeGroups.push(response.data.group);
    $scope.modal.hide();
    $ionicPopup.alert({
      title: 'Group Successfully Created',
      cssClass: 'alert-success'
    });
  }

  function init(e) {
    initData();
    initModal();

    Group.getAllGroups()
      .then(setupGroups, handleError);

    $ionicLoading.show({
      template: 'Loading...'
    });
  }

});
