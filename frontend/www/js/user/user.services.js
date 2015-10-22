angular.module('starter.services')

.factory('User', function($localstorage) {
  return {
    getId: function() {
      // store the user id after login
    },
    setSession: function(token) {
      $localstorage.set('token', token);
    },
    removeSession: function() {
      $localstorage.remove('token');
    },
    getSession: function() {
      return $localstorage.get('token');
    }
  }
});
