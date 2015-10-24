angular.module('starter.services')

.factory('User', function($localstorage) {
  var user;

  return {
    getUserInfo: function() {
      return user;
    },
    setSession: function(token, userInfo) {
      user = userInfo;
      $localstorage.set('token', token);
    },
    removeSession: function() {
      user = {};
      $localstorage.remove('token');
    },
    getSession: function() {
      return $localstorage.get('token');
    }
  }
});
