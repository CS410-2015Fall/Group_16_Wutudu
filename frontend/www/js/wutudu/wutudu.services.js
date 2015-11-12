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
    },
    finishWutudu: function (options) {
      var payload = {
        method: 'POST',
        url: '/groups/' + options.groupId + '/pre_wutudu/' + options.wutuduId + '/finish'
      };
      return $httpService.makeRequest(payload);
    }
  };

});
