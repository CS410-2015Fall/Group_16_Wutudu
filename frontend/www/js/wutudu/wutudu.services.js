angular.module('starter.services')

.factory('Wutudu', function($httpService) {

  return {
    getInProgressWutudu: function(options) {
      if (!options.wutuduId || !options.groupId) {
        return;
      }
      var payload = {
        method: 'GET',
        url: '/groups/' + options.groupId + '/pre_wutudu/' + options.wutuduId
      };
      return $httpService.makeRequest(payload);

    },
    getUpcomingWutudus: function(options) {
      if(options.groupId) {
        // return upcoming wutudus for this group
      } else if(options.friendId) {
        // return upcoming wutudus for all the group that contains friendId
      }
    },
    createWutudu: function(options) {
      var payload = {
            method: 'POST',
            data: options.data,
            url: '/groups/' + options.groupId + '/pre_wutudu'
          };
      return $httpService.makeRequest(payload);
    },
    sendAnswers: function(options) {
      var payload = {
            method: 'POST',
            data: options.data,
            url: '/groups/' + options.groupId + '/pre_wutudu/' + options.wutuduId + '/answers'
          };
      return $httpService.makeRequest(payload);
    }
  };

});
