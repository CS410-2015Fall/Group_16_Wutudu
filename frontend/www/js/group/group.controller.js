angular.module('starter.controllers')

.controller('GroupCtrl', function($scope, $stateParams, $state,
         $ionicPopup, $ionicModal, $msgBox, Friend, Group, Wutudu) {
  var groupId = $stateParams.groupId,
      config = {
        groupId: groupId
      };

  $scope.data = {};

  $scope.inProgressWutudus = Wutudu.getInProgressWutudus(config);
  $scope.upcomingWutudus = Wutudu.getInProgressWutudus(config);

  $scope.group = Group.getGroup(config)
    .then(setupGroup, handleError);

  function setupGroup(response) {
    var data = response.data,
        members = response.data.group_users,
        activeMembers = members.active_users,
        pendingMembers = members.pending_users;
    $scope.activeMembers = activeMembers;
    $scope.pendingMembers = pendingMembers;
  }

  function setupFriends(response) {
    var mapIdFn = function(member) {
          return member.id;
        },
        friends = response.data.friendships.friends,
        activeIds = $scope.activeMembers.map(mapIdFn),
        pendingIds = $scope.pendingMembers.map(mapIdFn),
        memberIds = activeIds.concat(pendingIds),
        isGroupMembers = function(friend) {
          return memberIds.indexOf(friend.id) === -1;
        };

    $scope.data.friends = friends.filter(isGroupMembers);
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

  $scope.addFriendToGroup = function() {
    Friend.getFriends(config)
      .then(setupFriends, handleError);
    var isFriendInvited = function(friend) {
          return friend.invited;
        },
        mapFriendEmails = function(friend) {
          return friend.email;
        },
        updatePendingList = function(friend) {
          if(friend.invited) {
            $scope.pendingMembers.push(friend);
          }
        },
        inviteSucess = function(response) {
            var data = response.data,
                msg = {
                  title: 'Invite to group',
                  template: '<span>' + JSON.stringify(data) + '</span>'
                };
            $msgBox.show($scope, msg);
        },
        handleAddFriend = function(e) {
          var friendsToInvite = $scope.data.friends;

          friendsToInvite = friendsToInvite.filter(isFriendInvited);
          friendsToInvite.forEach(updatePendingList);
          friendsToInvite = friendsToInvite.map(mapFriendEmails);
          data = {
            "emails" : friendsToInvite
          };

          Object.assign(config, data);
          Group.inviteFriends(config)
            .then(inviteSucess, handleError);
          console.debug('Adding friend to group');
        },
        addFriendTplConfig = Friend.addFriendTplConfig($scope, handleAddFriend);

    $ionicPopup.show(addFriendTplConfig);
  };

  $scope.showWutuduQuestion = function(question) {
    $scope.question = Wutudu.getQuestions(question);
    $ionicPopup.show({
      templateUrl: 'templates/wutudu/questionPage.html',
      title: 'Question',
      scope: $scope,
      buttons: [
        { text: 'Ok', type: 'button-positive'}
      ]
    });
  };

  $scope.showWutuduDetail = function(wutudu) {
    // use wutudu object to show the details
    $ionicPopup.show({
      templateUrl: 'templates/wutudu/detailPage.html',
      title: 'Wutudu',
      buttons: [
        { text: 'Ok', type: 'button-positive'}
      ]
    });
  };

  $scope.showCreateWutudu = function() {
    $state.go('app.createWutudu', config);
  };

});
