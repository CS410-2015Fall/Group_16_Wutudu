angular.module('starter.controllers')

.controller('GroupCtrl', function($scope, $stateParams, $state,
    $ionicPopup, $ionicModal, $ionicLoading, $msgBox, Friend,
    Group, Wutudu, ErrorPopup) {

  var groupId = $stateParams.groupId,
      groupName = $stateParams.groupName,
      config = {
        groupId: groupId
      };

  // 0 Upcoming Wutudus
  // 1 In progress Wutudus
  // 2 Active Group Members
  // 3 Pending Group Members
  $scope.listsShow = [true, true, false, false]

  $scope.$on('$ionicView.enter', init);
  $scope.$on('$ionicView.leave', onExit);

  $scope.toggleList = function(i) {
    $scope.listsShow[i] = !$scope.listsShow[i];
  };

  $scope.doRefresh = function () {
    init();
  };

  $scope.showAddFriend = function() {
    Friend.getFriends(config)
      .then(setupFriends, handleError);
  };

  $scope.addFriendToGroup = function(e) {
    var friendsToInvite = getFriendsToInvite();
    angular.merge(config, {
      "emails" : friendsToInvite
    });
    Group.inviteFriends(config)
      .then(inviteSuccess, handleError);
    $scope.cancelInviteFriends();
  };

  $scope.showPreWutuduOptions = function (preWutudu) {
    $scope.activePreWutudu = preWutudu;
    $scope.wutuduModal.show();
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
    $scope.cancelPreWutuduOptions();
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
    $scope.wutuduModal.hide();
  };

  $scope.cancelInviteFriends = function() {
    $scope.inviteFriendsModal.hide();
  };

  function initModal() {
    var wutuduOptionsUrl = 'templates/wutudu/optionsPopup.html',
        wutuduModalConfig = {
            scope: $scope,
            animation: 'slide-in-up'
        },
        inviteFriendsUrl = 'templates/group/inviteFriendsModal.html',
        inviteFriendsModalConfig = {
            scope: $scope,
            animation: 'slide-in-up'
        };


    $ionicModal
      .fromTemplateUrl(wutuduOptionsUrl, wutuduModalConfig)
      .then(setupWutuduModal);

    $ionicModal
      .fromTemplateUrl(inviteFriendsUrl, inviteFriendsModalConfig)
      .then(setupInviteFriendsModal);
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
    $scope.$broadcast('scroll.refreshComplete');
  }

  function setupWutuduModal(modal) {
    $scope.wutuduModal = modal;
  }

  function setupInviteFriendsModal(modal) {
    $scope.inviteFriendsModal = modal;
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

    var potMems = friends.filter(potentialMembers);
    if (potMems.length <= 0) {
      $ionicPopup.alert({
        title: 'No Available Friends To Invite To This Group',
        cssClass: 'alert-success'
      });
    } else {
      $scope.data.friends = potMems;
      $scope.inviteFriendsModal.show();
    }

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

      // Extract the time from the date object
      var meridian = ['AM', 'PM'];
      var hours = eventDate.getHours();
      var minutes = eventDate.getMinutes();
      var hoursRes = hours > 12 ? (hours - 12) : hours;
      var currentMeridian = meridian[parseInt(hours / 12)];
      var displayHours = ('00' + hoursRes).slice(-2);
      var displayMinutes = ('00' + minutes).slice(-2);
      preWutudu.display_date = stringDate + displayHours + ':' + displayMinutes + ' ' + currentMeridian;

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

  function inviteSuccess(response) {
      $ionicPopup.alert({
        title: 'Invite Friends To Group Success',
        cssClass: 'alert-success'
      });
  }

  function preWutuduSuccess(response) {
    var newWutudu = response.data.wutudu_event;
    filterCompletedWutudu(newWutudu.pre_wutudu_id);
    $scope.wutuduEvents.push(formatWutudu([newWutudu])[0]);
    $scope.cancelPreWutuduOptions();
    $state.reload();
  }

  function onExit(e) {
    $scope.wutuduModal.remove();
    $scope.inviteFriendsModal.remove();
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
