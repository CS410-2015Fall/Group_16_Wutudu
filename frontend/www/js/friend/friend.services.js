angular.module('starter.services')

.factory('Friend', function ($httpService) {

  return {
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
      };
      return $httpService.makeRequest(payload);
    }
  };
});
