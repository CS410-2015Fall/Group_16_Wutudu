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

  var optionsTplUrl = 'templates/wutudu/optionsPopup.html',
    modelConfig = {
        scope: $scope,
        animation: 'slide-in-up'
    };
  $ionicModal
    .fromTemplateUrl(optionsTplUrl, modelConfig)
    .then(setupModal);

  function setupGroup(response) {
    var data = response.data,
        members = data.group_users,
        preWutudus = data.pre_wutudus
        wutuduEvents = data.wutudu_events,
        activeMembers = members.active_users,
        pendingMembers = members.pending_users;

    $scope.activeMembers = activeMembers;
    $scope.pendingMembers = pendingMembers;
    $scope.inProgressWutudus = formatPrewutudu(preWutudus);
    $scope.wutuduEvents = formatWutudu(wutuduEvents);
  }

  function setupModal(modal) {
    $scope.modal = modal;
    $scope.activePreWutudu = null;
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

  function formatWutudu(wutudus) {
    var returnWutudus = [];
    angular.forEach(wutudus, function(wutudu, key) {
      // Format the JSON date as a string Tue Oct 27 2015
      var eventDate = new Date(wutudu.event_time),
          stringDate = eventDate.toString();
      stringDate = stringDate.substring(0, stringDate.indexOf(eventDate.toTimeString()));
      wutudu.display_date = stringDate;
      this.push(wutudu);
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

  function filterCompletedWutudu(pre_wutudu_id) {
    $scope.inProgressWutudus = $scope.inProgressWutudus.filter(function (w) {
      return w.pre_wutudu_id !== pre_wutudu_id;
    });
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

  $scope.showPreWutuduOptions = function (preWutudu) {
    $scope.activePreWutudu = preWutudu;
    $scope.modal.show();
  };

  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  $scope.cancelPreWutuduOptions = function() {
    $scope.modal.hide();
  };

  $scope.displayStatus = function (preWutudu) {
    if (!preWutudu) {
      return '';
    }
    return preWutudu.completed_answers + ' / ' +
          preWutudu.total_possible + ' answered';
  };

  $scope.userAnswered = function (preWutudu) {
    if (!preWutudu) {
      return false;
    }
    return (preWutudu.user_answer !== null);
  };

  $scope.showWutuduQuestion = function(preWutudu) {
    config.preWutudu = preWutudu;
    config.wutuduId = preWutudu.pre_wutudu_id.toString();
    $state.go('app.answerWutudu', config);
  };

  $scope.finishPreWutudu = function(preWutudu) {
    config.wutuduId = preWutudu.pre_wutudu_id.toString();
    Wutudu.finishWutudu(config).then(function (response) {
      var newWutudu = response.data.wutudu_event;
      $scope.cancelPreWutuduOptions();
      filterCompletedWutudu(newWutudu.pre_wutudu_id);
      $scope.wutuduEvents.push(formatWutudu([newWutudu])[0]);
    }, function (response) {
      response.config.headers = JSON.stringify(response.config.headers);
      response.config.data = JSON.stringify(response.config.data);
      $scope.response = response;
      $ionicPopup.show({
        title: 'Finish Wutudu error',
        templateUrl: 'templates/errorPopup.html',
        scope: $scope,
        buttons: [{ text: 'OK' }]
      });
    });
  };

  $scope.canEndPreWutudu = function(preWutudu) {
    if (!preWutudu) {
      return false;
    }
    return preWutudu.completed_answers > 0;
  };

  $scope.showWutuduDetail = function(wutudu) {
    // use wutudu object to show the details
    // TODO
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
