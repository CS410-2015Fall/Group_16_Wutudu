angular.module('starter.services')

.factory('Wutudu', function($httpService) {

  return {
    getInProgressWutudus: function(options) {
      if(options.groupId) {
        // return in progress wutudus for this group
      } else if(options.friendId) {
        // return in progress wutudus for all the group that contains friendId
      }
    },
    getUpcomingWutudus: function(options) {
      if(options.groupId) {
        // return upcoming wutudus for this group
      } else if(options.friendId) {
        // return upcoming wutudus for all the group that contains friendId
      }
    },
    createWutudu: function(config) {
      var payload = {
            method: 'POST',
            data: config.data,
            url: '/groups/' + config.groupId + '/prewutudu'
          };
      return $httpService.makeRequest(payload);
    },
    getQuestions: function(wutudu) {
      // use wutudu id to retrieve the questions from server
    }
  };

});
