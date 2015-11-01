angular.module('starter.services')

.factory('User', function($localstorage) {

  return {
    getUserInfo: function() {
      var user = $localstorage.get('user');
      return user? JSON.parse(user): {};
    },
    setSession: function(token, userInfo) {
      $localstorage.set('user', JSON.stringify(userInfo));
      $localstorage.set('token', token);
    },
    removeSession: function() {
      $localstorage.remove('user');
      $localstorage.remove('token');
    },
    getSession: function() {
      return $localstorage.get('token');
    }
  };
});
