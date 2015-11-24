angular.module('starter.controllers')

.controller('GroupCtrl', function($scope, $stateParams, $state,
    $ionicPopup, $ionicModal, $ionicLoading, $msgBox, Friend,
    Group, Wutudu, ErrorPopup) {

  var groupId = $stateParams.groupId,
      groupName = $stateParams.groupName,
      config = {
        groupId: groupId
      };

  $scope.$on('$ionicView.enter', init);
  $scope.$on('$ionicView.leave', onExit);

  $scope.showAddFriend = function() {
    Friend.getFriends(config)
      .then(setupFriends, handleError);
    displayFriendModal();
  };

  $scope.addFriendToGroup = function(e) {
    var friendsToInvite = getFriendsToInvite();
    angular.merge(config, {
      "emails" : friendsToInvite
    });
    Group.inviteFriends(config)
      .then(inviteSucess, handleError);
  };

  $scope.showPreWutuduOptions = function (preWutudu) {
    $scope.activePreWutudu = preWutudu;
    $scope.modal.show();
  };

  $scope.displayStatus = function (preWutudu) {
    var status = preWutudu?
    preWutudu.completed_answers + ' / ' +
          preWutudu.total_possible + ' answered' : '';
    return status;
  };

  $scope.userAnswered = function (preWutudu) {
    var answer = preWutudu && preWutudu.user_answer;
    return answer? true: false;
  };

  $scope.answeredStateString = function (preWutudu) {
    var user_answer = preWutudu && preWutudu.user_answer;
    return !user_answer? 'Unanswered':
      preWutudu.user_answer.declined? 'Declined' : 'Answered';
  };

  $scope.showWutuduQuestion = function(preWutudu) {
    config.preWutudu = preWutudu;
    config.wutuduId = preWutudu.pre_wutudu_id.toString();
    $state.go('app.answerWutudu', config);
  };

  $scope.declineWutudu = function(preWutudu) {
    config.preWutudu = preWutudu;
    config.wutuduId = preWutudu.pre_wutudu_id.toString(); 
    $scope.answers = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
    var options = angular.copy(config);
    options.data = {'user_answer' : {
      'answers': $scope.answers
    }};
    Wutudu.sendAnswers(options).then(function (response) {
      // $ionicPopup.alert({
      //   title: 'You have declined this Wutudu',
      // });
      $state.reload();
    }, function (response) {
      $scope.response = response;
      ErrorPopup.displayResponse(response.status,
                                 'Decline Wutudu Error',
                                 response.data.errors);
    });
    $scope.modal.hide();
  };

  $scope.finishPreWutudu = function(preWutudu) {
    config.wutuduId = preWutudu.pre_wutudu_id.toString();
    Wutudu.finishWutudu(config).then(preWutuduSuccess, handleError);
  };

  $scope.canEndPreWutudu = function(preWutudu) {
    var result = preWutudu && preWutudu.completed_answers > 0;
    return result? true: false;
  };

  $scope.showWutuduDetail = function(wutudu) {
    config.wutudu = wutudu;
    config.wutuduId = wutudu.id;
    $state.go('app.wutuduDetails', config);
  };

  $scope.showCreateWutudu = function() {
    $state.go('app.createWutudu', config);
  };

  $scope.cancelPreWutuduOptions = function() {
    $scope.modal.hide();
  };

  function initModal() {
    var optionsTplUrl = 'templates/wutudu/optionsPopup.html',
        modelConfig = {
            scope: $scope,
            animation: 'slide-in-up'
        };

    $ionicModal
      .fromTemplateUrl(optionsTplUrl, modelConfig)
      .then(setupModal);
  }

  function initData() {
    $scope.data = {
      name: groupName
    };
    $scope.activePreWutudu = null;
  }

  function setupGroup(response) {
    var data = response.data,
        members = data.group_users,
        preWutudus = data.pre_wutudus,
        wutuduEvents = data.wutudu_events,
        activeMembers = members.active_users,
        pendingMembers = members.pending_users;

    $scope.activeMembers = activeMembers;
    $scope.pendingMembers = pendingMembers;
    $scope.inProgressWutudus = formatPrewutudu(preWutudus);
    $scope.wutuduEvents = formatWutudu(wutuduEvents);
    $ionicLoading.hide();
  }

  function setupModal(modal) {
    $scope.modal = modal;
  }

  function setupFriends(response) {
    var mapFriendId = function(member) {
          return member.id;
        },
        friends = response.data.friendships.friends,
        activeIds = $scope.activeMembers.map(mapFriendId),
        pendingIds = $scope.pendingMembers.map(mapFriendId),
        memberIds = activeIds.concat(pendingIds),
        potentialMembers = function(friend) {
          return memberIds.indexOf(friend.id) === -1;
        };

    $scope.data.friends = friends.filter(potentialMembers);
  }

  function displayFriendModal() {
    var tplConfig = {
      templateUrl: 'templates/friend/addFriend.html',
      title: 'Add Friend to Group',
      subTitle: 'Please Choose Your Friend To Add',
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

  function getFriendsToInvite() {
    var friendsToInvite = $scope.data.friends,
        isFriendInvited = function(friend) {
          return friend.invited;
        },
        mapFriendEmails = function(friend) {
          return friend.email;
        },
        updatePendingList = function(friend) {
            if(friend.invited) {
              $scope.pendingMembers.push(friend);
            }
        };

    friendsToInvite = friendsToInvite.filter(isFriendInvited);
    friendsToInvite.forEach(updatePendingList);
    friendsToInvite = friendsToInvite.map(mapFriendEmails);
    return friendsToInvite;
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

  function handleError(response) {
    $scope.response = response;
    $ionicLoading.hide();
    ErrorPopup.displayResponse(response.status,
                               'Group Error',
                               response.data.errors);
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

  function filterCompletedWutudu(pre_wutudu_id) {
    $scope.inProgressWutudus = $scope.inProgressWutudus.filter(function (w) {
      return w.pre_wutudu_id !== pre_wutudu_id;
    });
  }

  function inviteSucess(response) {
      var data = response.data,
          msg = {
            title: 'Invite To Group',
            template: '<span>' + JSON.stringify(data) + '</span>'
          };
      $msgBox.show($scope, msg);
  }

  function preWutuduSuccess(response) {
    var newWutudu = response.data.wutudu_event;
    filterCompletedWutudu(newWutudu.pre_wutudu_id);
    $scope.wutuduEvents.push(formatWutudu([newWutudu])[0]);
    $scope.cancelPreWutuduOptions();
    $state.reload();
  }

  function onExit(e) {
    $scope.modal.remove();
  }

  function init(e) {
    initModal();
    initData();
    Group.getGroup(config)
      .then(setupGroup, handleError);
    $ionicLoading.show({
        template: 'Loading...'
    });
  }
});
