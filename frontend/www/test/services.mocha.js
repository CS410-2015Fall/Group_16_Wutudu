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
