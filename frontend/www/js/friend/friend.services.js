angular.module('starter.services')

.factory('Friend', function(){
  return {
    getFriends: function() {
      // get friends from server
      return [{name: 'Dan'}]; // remove stub
    }
  }
});
