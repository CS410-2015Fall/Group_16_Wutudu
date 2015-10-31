angular.module('starter.controllers')

.controller('GroupCtrl', function($scope, $stateParams, $state,
         $ionicPopup, $ionicModal, $msgBox, Friend, Group, Wutudu) {
  var groupId = $stateParams.groupId,
      groupName = $stateParams.groupName,
      config = {
        groupId: groupId
      };

  $scope.data = {
    name: groupName
  };

  $scope.group = Group.getGroup(config)
    .then(setupGroup, handleError);

  function setupGroup(response) {
    var data = response.data,
        members = data.group_users,
        preWutudus = data.pre_wutudus,
        activeMembers = members.active_users,
        pendingMembers = members.pending_users;

    $scope.activeMembers = activeMembers;
    $scope.pendingMembers = pendingMembers;
    $scope.inProgressWutudus = formatPrewutudu(preWutudus);
  }

  function formatPrewutudu(preWutudus) {
    var returnWutudus = [];
    angular.forEach(preWutudus, function(preWutudu, key) {
      // Format the JSON date as a string Tue Oct 27 2015
      var eventDate = new Date(preWutudu.event_date),
          stringDate = eventDate.toString();
      stringDate = stringDate.substring(0, stringDate.indexOf(eventDate.toTimeString()));
      preWutudu.display_date = stringDate;
      this.push(preWutudu);
    }, returnWutudus);
    return returnWutudus;
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

  $scope.displayStatus = function (preWutudu) {
    return preWutudu.completed_answers + ' / ' +
          preWutudu.total_possible + ' answered';
  };

  $scope.userAnswered = function (preWutudu) {
    return (preWutudu.user_answer === null);
  };

  $scope.showWutuduQuestion = function(preWutudu) {
    config.preWutudu = preWutudu;
    config.wutuduId = preWutudu.pre_wutudu_id.toString();
    $state.go('app.answerWutudu', config);
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
