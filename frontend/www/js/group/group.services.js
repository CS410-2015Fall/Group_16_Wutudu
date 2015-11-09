angular.module('starter.services')

.factory('Group', function($httpService) {
  return {
    getGroup: function(config) {
      if(!config.groupId) throw 'Need to specify groupId to get group';
      var payload = {
            method: 'GET',
            url: '/groups/' + config.groupId
          };
      return $httpService.makeRequest(payload);
    },
    inviteFriends: function(config) {
      if(!config.groupId) throw 'Need to specify groupId to add';
      if(!config.emails || !config.emails.length) throw 'Need to specify at least 1 friend\'s email';
      var payload = {
            method: 'POST',
            data: {
              group_user: {
                emails : config.emails
              }
            },
            url: '/groups/' + config.groupId + '/users'
          };
      return $httpService.makeRequest(payload);
    },
    addGroup: function(config) {
      if(!config.groupId) throw 'Need to specify groupId to add';
      var payload = {
            method: 'PUT',
            url: '/groups/' + config.groupId + '/users'
          };
      return $httpService.makeRequest(payload);
    },
    removeGroup: function(config) {
      if(!config.groupId) throw 'Need to specify groupId to remove';
      var payload = {
            method: 'DELETE',
            url: '/groups/' + config.groupId + '/users'
          };
      return $httpService.makeRequest(payload);
    },
    getAllGroups: function() {
      var payload = {
            method: 'GET',
            url: '/groups'
          };
      return $httpService.makeRequest(payload);
    },
    createGroup: function(config) {
      if(!config.name) throw 'Need to specify group name to create';
      var payload = {
            method: 'POST',
            data: {
              group: {
                name: config.name,
                emails : config.emails
              }
            },
            url: '/groups'
          };
      return $httpService.makeRequest(payload);
    }
  };
});
