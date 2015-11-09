angular.module('starter.services')

.factory('Friend', function ($httpService) {

  return {
    addFriendTplConfig: function($scope, handleAddFriendFn) {
      return {
        templateUrl: 'templates/friend/addFriend.html',
        title: 'Add Friend to Group',
        subTitle: 'Please choose your friend to add',
        scope: $scope,
        buttons: [
           { text: 'Add',
             type: 'button-balanced',
             onTap: handleAddFriendFn
           },
         { text: 'Cancel', type: 'button-assertive'}
        ]
      }
    },
    getFriends: function () {
      var payload = {
        method: 'GET',
        url: '/friends'
      };
      return $httpService.makeRequest(payload);
    },
    sendFriendRequest: function (config) {
      var payload = {
        method: 'POST',
        data: { 'friendship' : { 'email' : config.email }},
        url: '/friends'
      };
      return $httpService.makeRequest(payload);
    },
    acceptFriendRequest: function (config) {
      var payload = {
        method: 'PUT',
        data: { 'friendship' : { 'email' : config.email }},
        url: '/friends'
      };
      return $httpService.makeRequest(payload);
    },
    removeFriend: function (config) {
      var payload = {
        method: 'DELETE',
        data: { 'friendship' : { 'email' : config.email }},
        url: '/friends'
      }
      return $httpService.makeRequest(payload);
    }
  }
});
