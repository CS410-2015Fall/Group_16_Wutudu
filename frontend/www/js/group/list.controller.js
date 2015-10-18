angular.module('starter.controllers')

.controller('GroupListCtrl', function($scope, $ionicPopup, $ionicModal,
      Friend, Group) {

  $scope.groups = Group.getAllGroups();
  $scope.friends = Friend.getFriends();

  $ionicModal.fromTemplateUrl('templates/group/createGroup.html', {
      scope: $scope,
      animation: 'slide-in-up'
  }).then(function(modal) {
      $scope.modal = modal;
  });

  $scope.createGroup = function() {
    $scope.modal.show();
  };
  $scope.cancelGroup = function() {
    $scope.modal.hide();
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

});
