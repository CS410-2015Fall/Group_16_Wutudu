// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova',
  'starter.controllers', 'starter.services', 'ionic-datepicker', 'ionic-timepicker'])

.run(function ($ionicPlatform, $ionicHistory) {
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

    // Triggered when devices with a hardware back button (Android) is clicked by the user
    // This is a Cordova/Phonegap platform specifc method
    function onHardwareBackButton(e) {
      var backView = $ionicHistory.backView();
      if (!backView) {
        // there is no back view, so close the app instead
        ionic.Platform.exitApp();
      } else {
        var historyId = $ionicHistory.backView().historyId;
        historyId = (historyId) ? historyId : 'ion1';
        var viewHistory = $ionicHistory.viewHistory();
        if (!viewHistory.histories[historyId]) {
          // Default back button functionality
          backView.go();
        } else {
          // Go back to the hamburger
          $ionicHistory.goToHistoryRoot(historyId);
        }
      }
      e.preventDefault();
      return false;
    }

    $ionicPlatform.registerBackButtonAction(
      onHardwareBackButton,
      100 // Return to previous view priority
    );
  });

  String.prototype.hashString = function() {
    var hash = 0, i, chr, len;
    if (this.length === 0) return hash;
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
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('login', {
    url: '/login',
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
    views: {
      'menuContent': {
        templateUrl: 'templates/friend/list.html',
        controller: 'FriendListCtrl'
      }
    }
  })

  .state('app.groupList', {
    url: '/group' ,
    views: {
      'menuContent': {
        templateUrl: 'templates/group/list.html',
        controller: 'GroupListCtrl'
      }
    }
  })

  .state('app.group', {
    url: '/group/:groupId/:groupName',
    views: {
      'menuContent': {
        templateUrl: 'templates/group/group.html',
        controller: 'GroupCtrl'
      }
    }
  })

  .state('app.createWutudu', {
    url: '/group/:groupId/createWutudu',
    views: {
      'menuContent': {
        templateUrl: 'templates/wutudu/createWutudu.html',
        controller: 'WutuduCreateCtrl'
      }
    },
    params: { groupName: '' }
  })

  .state('app.answerWutudu', {
    url: '/group/:groupId/answerWutudu/:wutuduId',
    views: {
      'menuContent': {
        templateUrl: 'templates/wutudu/questionPage.html',
        controller: 'WutuduQuestionCtrl'
      }
    },
    params: { 
      preWutudu: null,
      groupName:''
    }
  })

  .state('app.wutuduDetails', {
    url: '/group/:groupId/wutuduDetails/:wutuduId',
    views: {
      'menuContent': {
        templateUrl: 'templates/wutudu/detailPage.html',
        controller: 'WutuduDetailsCtrl'
      }
    },
    params: { wutudu: null }
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
})

.directive('googleplace', function($timeout) {
  return {
    scope: {
      setLocation: "&"
    },
    link: function(scope, element, attrs, model) {
        var options = {
            types: [],
            componentRestrictions: {}
        };
        scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

        google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
            var place = scope.gPlace.getPlace();
            if (place.geometry && place.geometry.location) {
              lat = place.geometry.location.lat();
              lng = place.geometry.location.lng();
              scope.setLocation({lat: lat, lng: lng});
            }
        });

        $timeout(function(){
            var predictionContainer = angular.element(document.getElementsByClassName('pac-container'));
            predictionContainer.attr('data-tap-disabled', true);
            predictionContainer.css('pointer-events', 'auto');
            predictionContainer.bind('click', function(arg){
                element[0].blur();
            });
        }, 500);
      }
  };
})

.directive('lowercase', function() {
  return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        function parser(text) {
          return (text || '').toLowerCase();
        }
        ngModel.$parsers.push(parser);
      }
    };
});