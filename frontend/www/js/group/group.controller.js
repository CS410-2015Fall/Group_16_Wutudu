angular.module('starter.controllers')

.controller('GroupCtrl', function($scope, $stateParams,
         $ionicPopup, $ionicModal, Friend, Group, Wutudu) {
  var groupId = $stateParams.groupId,
      config = {
              token: $scope.$root.TOKEN,
              urlRoot: $scope.$root.SERVER_URL
            };

  // $scope.group = Group.getGroup(groupId);
  Friend.getFriends(config).then(setupFriends, handleError);

  //TODO
  $scope.data = {};

  function setupFriends(response) {
    var friends = response.data.friendships.friends;
    $scope.data.friends = friends; // use it for add friend
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

  $scope.inProgressWutudus = Wutudu.getInProgressWutudus({groupId: groupId});
  $scope.upcomingWutudus = Wutudu.getInProgressWutudus({groupId: groupId});

  $scope.addFriendToGroup = function() {
    $ionicPopup.show({
       templateUrl: 'templates/friend/addFriend.html',
       title: 'Add Friend to Group',
       subTitle: 'Please choose your friend to add',
       scope: $scope,
       buttons: [
          { text: 'Add',
            type: 'button-balanced',
            onTap: function(e) {
              console.debug('Adding friend to group');
            }
          },
        { text: 'Cancel', type: 'button-assertive'}
       ]
    });
  }

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
  }

  $scope.showWutuduDetail = function(wutudu) {
    // use wutudu object to show the details
    $ionicPopup.show({
      templateUrl: 'templates/wutudu/detailPage.html',
      title: 'Wutudu',
      buttons: [
        { text: 'Ok', type: 'button-positive'}
      ]
    });
  }

  $ionicModal.fromTemplateUrl('templates/wutudu/createWutudu.html', {
      scope: $scope,
      animation: 'slide-in-up'
  }).then(function(modal) {
      $scope.modal = modal;
  });

  $scope.showCreateWutudu = function() {
    $scope.modal.show();
  };
  $scope.hideCreateWutudu = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
    $scope.wutudu = {};
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
    console.log('modal hidden');
    // $scope.wutudu = {};
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
    console.log('modal removed');
    // $scope.wutudu = {};
  });

  $scope.createWutudu = function(wutuduFormData) {
    console.log('Create Wutudu');
    Wutudu.createWutudu(angular.copy(wutuduFormData));
    $scope.hideCreateWutudu();
  }

});
