describe('Controller', function() {
  var APP_CTRL = "AppCtrl",
      User,
      Auth,
      $controller,
      $rootScope;

  beforeEach(function() {
    module('starter');
    inject(function(_$controller_, _Auth_, _User_, $httpBackend, _$rootScope_) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      User = _User_;
      Auth = _Auth_;
      $httpBackend.whenGET().respond({});

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
      sinon.stub(User, 'getUserInfo',function(){});
      sinon.stub(User, 'removeSession',function(){});
    });
  });

  describe('AppCtrl', function() {
    var $scope;
    beforeEach(function() {
      $scope = $rootScope.$new();
      $controller(APP_CTRL, { $scope: $scope });
      $scope.$emit('$ionicView.enter');
      $scope.$digest();
    });

    it('should get user info', function() {
      expect(User.getUserInfo.callCount).to.be.equal(1);
    });

    it('should handle logout', function() {
      $scope.logout();
      expect(Auth.logout.callCount).to.be.equal(1);
      expect(User.removeSession.callCount).to.be.equal(1);
    });
  });
});
