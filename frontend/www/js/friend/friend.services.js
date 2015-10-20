angular.module('starter.services')

.factory('Friend', function ($http) {
  console.log('friend service');

  return {
    getFriends: function (config) {
      return $http({
        method: 'GET',
        headers: {
         'Content-Type': 'application/json',
         'Authorization' : 'Token token=' + config.token
        },
        url: config.urlRoot + '/friends',
      });
    },
    sendFriendRequest: function (config) {
      return $http({
        method: 'POST',
        data: config.data,
        headers: {
         'Content-Type': 'application/json',
         'Authorization' : 'Token token=' + config.token
        },
        url: config.urlRoot + '/friends',
      });
    },
    acceptFriendRequest: function (config) {
      return $http({
        method: 'PUT',
        data: config.data,
        headers: {
         'Content-Type': 'application/json',
         'Authorization' : 'Token token=' + config.token
        },
        url: config.urlRoot + '/friends',
      });
    },
    removeFriend: function (config) {
      return $http({
        method: 'DELETE',
        data: config.data,
        headers: {
         'Content-Type': 'application/json',
         'Authorization' : 'Token token=' + config.token
        },
        url: config.urlRoot + '/friends',
      });
    }
  }
});
