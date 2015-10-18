angular.module('starter.services')

.factory('Wutudu', function() {

  return {
    getInProgressWutudus: function(options) {
      if(options.groupId) {
        // return in progress wutudus for this group
      } else if(options.friendId) {
        // return in progress wutudus for all the group that contains friendId
      }
      return [{ name: 'CPSC 410'}];  // TODO remove stubs
    },
    getUpcomingWutudus: function(options) {
      if(options.groupId) {
        // return upcoming wutudus for this group
      } else if(options.friendId) {
        // return upcoming wutudus for all the group that contains friendId
      }
      return [{ name: 'CPSC 410'}];  // TODO remove stubs
    },
    createWutudu: function(wutudu) {
      // validate and post this to server
    },
    getQuestions: function(wutudu) {
      // use wutudu id to retrieve the questions from server
      return [{name: 'Question1'}, {name: 'Question2'}, {name: 'Question3'}]; // TODO remove stubs
    }
  };

});
