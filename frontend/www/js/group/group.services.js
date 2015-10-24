angular.module('starter.services')

.factory('Group', function($httpService) {

  return {
    getGroup: function(config) {
      if(!config.groupId) throw "Group id needed to get group";
      var payload = {
            method: 'GET',
            url: '/groups/' + config.groupId + '/users'
          };
      return $httpService.makeRequest(payload);
    },
    inviteFriends: function(config) {
      if(!config.groupId) throw "Need to specify groupId to add";
      if(!config.emails.length) throw "Need to invite at least one friend";
      var memberEmails = config.emails,
          data = {
            group_user: {
              emails : memberEmails
            }
          },
          payload = {
            method: 'POST',
            data: data,
            url: '/groups/' + config.groupId + '/users'
          };
      return $httpService.makeRequest(payload);
    },
    addGroup: function(config) {
      if(!config.groupId) throw "Need to specify groupId to add";
      var payload = {
        method: 'PUT',
        url: '/groups/' + config.groupId + '/users'
      };
      return $httpService.makeRequest(payload);
    },
    removeGroup: function(config) {
      if(!config.groupId) throw "Need to specify groupId to remove";
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
      if(!config.name) throw "Please specify group name";
      var groupName = config.name,
          memberEmails = config.emails,
          data = {
            group: {
              name: groupName,
              emails : memberEmails
            }
          },
          payload = {
            method: 'POST',
            data: data,
            url: '/groups'
          };
      return $httpService.makeRequest(payload);
    }
  };
});
