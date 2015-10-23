angular.module('starter.services')

.factory('Group', function($http) {

  var makeRequest = function(config) {
    return $http({
      method: config.method,
      data: config.data,
      headers: {
       'Content-Type': 'application/json',
       'Authorization' : 'Token token=' + config.token
      },
      url: config.url,
    });
  }

  return {
    getGroup: function(groupId) {
      // validate and get group from server
    },
    getAllGroups: function(config) {
      var url = config.urlRoot + '/groups',
          token = config.token,
          payload = {
            method: 'GET',
            token: token,
            url: url
          };
          return makeRequest(payload);
    },
    createGroup: function(config) {
      var url = config.urlRoot + '/groups',
          token = config.token,
          groupName = config.name,
          memberEmails = config.emails,
          data = {
            group: {
              name: groupName,
              emails : memberEmails
            }
          },
          payload = {
            method: 'POST',
            token: token,
            data: data,
            url: url
          };
          return makeRequest(payload);
    }
  }
});
