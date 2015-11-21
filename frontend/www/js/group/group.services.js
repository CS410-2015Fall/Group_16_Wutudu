angular.module('starter.services')

.factory('Group', function($httpService) {
  return {
    getGroup: function(config) {
      if(!config.groupId) throw 'Need To Specify groupId To Get Group';
      var payload = {
            method: 'GET',
            url: '/groups/' + config.groupId
          };
      return $httpService.makeRequest(payload);
    },
    inviteFriends: function(config) {
      if(!config.groupId) throw 'Need To Specify groupId To Add';
      if(!config.emails || !config.emails.length) throw 'Need To Specify At Least 1 Friend\'s Email';
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
      if(!config.groupId) throw 'Need To Specify groupId To Add';
      var payload = {
            method: 'PUT',
            url: '/groups/' + config.groupId + '/users'
          };
      return $httpService.makeRequest(payload);
    },
    removeGroup: function(config) {
      if(!config.groupId) throw 'Need To Specify groupId To Remove';
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
      if(!config.name) throw 'Need To Specify Group Name To Create';
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
