angular.module('starter.services')

.factory('Group', function(User) {

  return {
    getGroup: function(groupId) {
      // validate and get group from server
      return { name: 'MockGroup' } // remove stub
    },
    getAllGroups: function() {
      // get all groups associated with user from server
      // use User.getId()
      return [{ name: 'Wutudu' }];  // remove stub
    }
  }
});
