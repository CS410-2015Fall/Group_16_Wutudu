describe('UserLoginController', function() {
  var $controller,
      Auth,
      $wutuduNotification,
      User;

  beforeEach(function() {
    module('starter');
    inject(function(_$controller_, _Auth_, _$wutuduNotification_, _User_){
      // The injector unwraps the underscores (_) from around the parameter names when matching
      $controller = _$controller_;
      Auth = _Auth_;
      $wutuduNotification = _$wutuduNotification_;
      User = _User_;

      var returnPromise = function(response) {
        return {
          then: function (cb) {
            cb(response);
          }
        };
      };
      sinon.stub(Auth, 'login', function () { 
        var response = {
          'data' : {
            'token' : 'f9l3nUGkks8CwOFFYNQfXgtt',
            'user' : { 'id' : 1, 'email' : 'f1@gmail.com', 'name' : 'Friend1' }
          }
        };
        return returnPromise(response);
      });
      sinon.stub($wutuduNotification, 'register', function () { 
        var deviceToken = 1;
        return returnPromise(deviceToken);
      });
      sinon.stub(User, 'getSession', function () { 
        return false;
      });
    });
  });

  describe('On Login button press', function() {
    var $scope, controller;

    beforeEach(function() {
      $scope = {};
      controller = $controller('LoginCtrl', { $scope: $scope });
    });

    it('should send a login request with valid credentials', function() {
      $scope.loginData = {
        email: 'f1@gmail.com',
        password: '97'
      };
      $scope.validateLogin();

      expect(Auth.login.callCount).to.equal(1);
    });

    it('should not send a login request with invalid credentials', function() {
      $scope.loginData = {
        email: '',
        password: ''
      };
      $scope.validateLogin();

      expect(Auth.login.callCount).to.equal(0);
    });
  });
});
