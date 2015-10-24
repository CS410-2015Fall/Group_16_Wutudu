// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function ($ionicPlatform) {
  $ionicPlatform.ready(function () {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  String.prototype.hashString = function() {
    var hash = 0, i, chr, len;
    if (this.length == 0) return hash;
    for (i = 0, len = this.length; i < len; i++) {
      chr   = this.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
  };

})
.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    cache: false,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('login', {
    url: '/login',
    cache: false,
    templateUrl: 'templates/user/login.html',
    controller: 'LoginCtrl'
  })

  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/user/signup.html',
    controller: 'SignupCtrl'
  })

  .state('app.friendList', {
    url: '/friend',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/friend/list.html',
        controller: 'FriendListCtrl'
      }
    }
  })

  .state('app.friend', {
    url: '/friend/:friendId',
    views: {
      'menuContent': {
        templateUrl: 'templates/friend/friend.html',
        controller: 'FriendCtrl'
      }
    }
  })

  .state('app.groupList', {
    url: '/group' ,
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/group/list.html',
        controller: 'GroupListCtrl'
      }
    }
  })

  .state('app.group', {
    url: '/group/:groupId',
    views: {
      'menuContent': {
        templateUrl: 'templates/group/group.html',
        controller: 'GroupCtrl'
      }
    }
  })

  .state('app.main', {
    url: '/main',
    views: {
      'menuContent': {
        templateUrl: 'templates/main.html',
        controller: 'MainCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});
