describe('AppServices', function() {
  /*jshint expr: true*/ // for chai syntax, testing only

  beforeEach(function() {
    module('starter');
  });

  describe('$httpService', function() {
    var $httpService, User, $httpBackend;
    beforeEach(inject(function(_$httpService_, _User_, _$httpBackend_) {
      $httpService = _$httpService_;
      User = _User_;
      $httpBackend = _$httpBackend_;
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
      }).to.throw(/config missing/);
    });
    it('should not make a request without url', function() {
      var config = {
        url: 'http://localhost'
      };
      expect(function() {
        $httpService.makeRequest(config);
      }).to.throw(/config missing/);
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

});
