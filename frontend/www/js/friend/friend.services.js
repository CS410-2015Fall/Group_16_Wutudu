angular.module('starter.services')

.factory('Friend', function ($httpService) {
  console.log('friend service');

  return {
    getFriends: function (config) {
      var payload = {
        method: 'GET',
        url: '/friends'
      };
      return $httpService.makeRequest(payload);
    },
    sendFriendRequest: function (config) {
      var payload = {
        method: 'POST',
        data: config.data,
        url: '/friends'
      };
      return $httpService.makeRequest(payload);
    },
    acceptFriendRequest: function (config) {
      var payload = {
        method: 'PUT',
        data: config.data,
        url: '/friends'
      };
      return $httpService.makeRequest(payload);
    },
    removeFriend: function (config) {
      var payload = {
        method: 'DELETE',
        data: config.data,
        url: '/friends'
      }
      return $httpService.makeRequest(payload);
    }
  }
});
