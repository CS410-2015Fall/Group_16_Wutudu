describe('AppServices', function() {
  /*jshint expr: true*/ // for chai syntax, testing only

  beforeEach(function() {
    module('starter');
  });

  describe('$httpService', function() {
    var $httpService, User, $httpBackend, $cordovaNetwork;
    beforeEach(inject(function(_$httpService_, _User_, _$httpBackend_, _$cordovaNetwork_) {
      $httpService = _$httpService_;
      User = _User_;
      $httpBackend = _$httpBackend_;
      $cordovaNetwork = _$cordovaNetwork_;
      sinon.stub($cordovaNetwork, 'isOffline', function() { return false; });
      $httpBackend.when('GET').respond({});
    }));
    it('should not make a request without config', function() {
      expect($httpService.makeRequest).to.throw(/No config/);
    });
    it('should not make a request without method', function() {
      var config = {
        method: 'GET'
      };
      expect(function() {
        $httpService.makeRequest(config);
      }).to.throw(/Config Missing/);
    });
    it('should not make a request without url', function() {
      var config = {
        url: 'http://localhost'
      };
      expect(function() {
        $httpService.makeRequest(config);
      }).to.throw(/Config Missing/);
    });
    it('should make request correctly', function() {
      var config = {
        method: 'GET',
        url: 'http://localhost'
      };
      expect($httpService.makeRequest(config)).to.be.ok;
    });
  });

  describe('Auth', function() {
    var Auth, $httpService;
    beforeEach(inject(function(_Auth_, _$httpService_) {
      Auth = _Auth_;
      $httpService = _$httpService_;
      sinon.stub($httpService, 'makeRequest', function() {});
    }));

    it('should login correctly', function() {
      var config = {
        deviceToken: 1,
        loginCreds: {
          email: 'f1@gmail.com',
          password: '97'
        }
      };
      Auth.login(config);
      expect($httpService.makeRequest.callCount).to.be.equal(1);
      var expectedArgs = {
        method: 'POST',
        url: '/login',
        data: {
          'login' : {
            email: 'f1@gmail.com',
            password: '97'
          }
        },
        deviceToken: 1
      };
      expect($httpService.makeRequest.args[0][0]).to.be.deep.equal(expectedArgs);
    });

    it('should signup correctly', function() {
      var config = {
        deviceToken: 1,
        user: {
          name: 'friend1',
          email: 'f1@gmail.com',
          password: '97'
        }
      };
      Auth.signup(config);
      expect($httpService.makeRequest.callCount).to.be.equal(1);
      var expectedArgs = {
        method: 'POST',
        url: '/users',
        data: {
          'user' : {
            name: 'friend1',
            email: 'f1@gmail.com',
            password: '97'
          }
        },
        deviceToken: 1
      };
      expect($httpService.makeRequest.args[0][0]).to.be.deep.equal(expectedArgs);
    });

    it('should logout correctly', function() {
      Auth.logout();
      expect($httpService.makeRequest.callCount).to.be.equal(1);
      var expectedArgs = {
        method: 'DELETE',
        url: '/logout'
      };
      expect($httpService.makeRequest.args[0][0]).to.be.deep.equal(expectedArgs);
    });
  });

  describe('$wutuduNotification', function() {
    var $rootScope, $wutuduNotification, $device, $state;
    beforeEach(inject(function(_$rootScope_, _$wutuduNotification_,
     $httpBackend, _$device_, _$state_) {
      $wutuduNotification = _$wutuduNotification_;
      $device = _$device_;
      $rootScope = _$rootScope_;
      $httpBackend.when('GET').respond({});
      $state = _$state_;
      sinon.stub(_$state_, 'go', function(arg) {});
    }));
    it('should mock browser register correctly', function() {
      sinon.stub($device, 'isBrowser', function() { return true; });
      sinon.stub($device, 'isAndroid', function() { return false; });
      $wutuduNotification.register().then(function(deviceToken) {
        expect(deviceToken).to.be.equal(1);
      });
      $rootScope.$apply();
    });
    it('should mock offline register correctly', function() {
      sinon.stub($device, 'isBrowser', function() { return false; });
      sinon.stub($device, 'isAndroid', function() { return true; });
      $wutuduNotification.register().then(function(deviceToken) {
        expect(deviceToken).to.be.equal(2);
      });
      $rootScope.$apply();
    });
    it('should handle register notifications', function() {
      $wutuduNotification.register();
      var mockEvent = {
        event: 'registered',
        regid: 1
      };
      $rootScope.$emit('$cordovaPush:notificationReceived', mockEvent);
      $rootScope.$apply();
      expect($state.go.callCount).to.be.equal(0);
      expect($state.go.args[0]).to.not.exist;
    });
    it('should handle message notifications', function() {
      $wutuduNotification.register();
      var mockEvent = {
        event: 'message',
        message: 'msg',
        payload: {}
      };
      $rootScope.$emit('$cordovaPush:notificationReceived', mockEvent);
      $rootScope.$apply();

    });
    it('should switch friend state correctly', function() {
      var mockPayload = {
        state: 'friend'
      };
      $wutuduNotification.switchState(mockPayload);
      expect($state.go.callCount).to.be.equal(1);
      expect($state.go.args[0][0]).to.be.equal('app.friendList');
    });
    it('should switch group state correctly', function() {
      var mockPayload = {
        state: 'group'
      };
      $wutuduNotification.switchState(mockPayload);
      expect($state.go.callCount).to.be.equal(1);
      expect($state.go.args[0][0]).to.be.equal('app.groupList');
    });
    it('should switch pre_wutudu state correctly', function() {
      var mockPayload = {
        state: 'pre_wutudu',
        group: {
          id: 1
        },
        pre_wutudu: {
          pre_wutudu_id: 1
        }
      };
      $wutuduNotification.switchState(mockPayload);
      expect($state.go.callCount).to.be.equal(1);
      expect($state.go.args[0][0]).to.be.equal('app.answerWutudu');
    });
    it('should switch wutudu state correctly', function() {
      var mockPayload = {
        state: 'wutudu',
        group: {
          id: 1
        },
        wutudu_event: {
          id: 1
        }
      };
      $wutuduNotification.switchState(mockPayload);
      expect($state.go.callCount).to.be.equal(1);
      expect($state.go.args[0][0]).to.be.equal('app.wutuduDetails');
    });
  });
});
