describe('Controller', function() {
  var APP_CTRL = "AppCtrl",
      User,
      Auth,
      $controller,
      controller;

  beforeEach(function() {
    module('starter');
    inject(function(_$controller_, _Auth_, _User_) {
      $controller = _$controller_;
      User = _User_;
      Auth = _Auth_;

      var returnPromise = function(response) {
        return {
          then: function (cb) {
            cb(response);
          }
        };
      };

      sinon.stub(Auth, 'logout', function() {
        var response = {};
        return returnPromise(response);
      });
      sinon.stub(User, 'removeSession',function(){});
    });
  });

  describe('AppCtrl', function() {
    var $scope;
    beforeEach(function() {
      $scope = {};
      controller = $controller(APP_CTRL, { $scope: $scope });
    });
    it('should handle logout', function() {
      $scope.logout();
      expect(Auth.logout.callCount).to.be.equal(1);
      expect(User.removeSession.callCount).to.be.equal(1);
    });
  });
});
