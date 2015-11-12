describe('UserSignupController', function() {
  var $controller,
      Auth,
      $wutuduNotification;

  beforeEach(function() {
    module('starter');
    inject(function(_$controller_, _Auth_, _$wutuduNotification_){
      // The injector unwraps the underscores (_) from around the parameter names when matching
      $controller = _$controller_;
      Auth = _Auth_;
      $wutuduNotification = _$wutuduNotification_;

      var returnPromise = function(response) {
        return {
          then: function (cb) {
            cb(response);
          }
        };
      };
      sinon.stub(Auth, 'signup', function () { 
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
    });
  });

  describe('On Signup button press', function() {
    var $scope, controller;

    beforeEach(function() {
      $scope = {};
      controller = $controller('SignupCtrl', { $scope: $scope });
    });

    it('should send a signup request with valid user details', function() {
      $scope.signupData = {
        name: 'Friend1',
        email: 'f1@gmail.com',
        password: '97'
      };
      $scope.validateSignup();

      expect(Auth.signup.callCount).to.equal(1);
    });

    it('should not send a signup request with invalid user details', function() {
      $scope.signupData = {
        name: '',
        email: '',
        password: ''
      };
      $scope.validateSignup();

      expect(Auth.signup.callCount).to.equal(0);
    });
  });
});
