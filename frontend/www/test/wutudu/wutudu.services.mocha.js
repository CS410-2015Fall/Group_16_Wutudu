describe('WutuduServices', function() {
  /*jshint expr: true*/ // for chai syntax, testing only
  var wutudu,
      $httpService,
      getFn,
      createFn,
      sendAnswersFn,
      finishFn;

  beforeEach(function() {
    module('starter.services');
    inject(function(_Wutudu_, _$httpService_) {
      wutudu = _Wutudu_;
      getFn = wutudu.getInProgressWutudu;
      createFn = wutudu.createWutudu;
      sendAnswersFn = wutudu.sendAnswers;
      finishFn = wutudu.finishWutudu;
      $httpService = _$httpService_;
      sinon.stub($httpService, 'makeRequest', function() { return true; });
    });
  });

  describe('When getting Wutudus', function() {
    it('should get specific Wutudu for the user', function() {
      var config = {
        groupId: '1',
        wutuduId: '2'
      };
      var expectedArgs = {
        method: 'GET',
        url: '/groups/1/pre_wutudu/2'
      };
      expect(getFn(config)).to.be.ok;
      expect($httpService.makeRequest.callCount).to.equal(1);
      expect($httpService.makeRequest.args[0][0])
        .to.deep.equal(expectedArgs);
    });
  });

  describe('When creating Wutudus', function() {
    it('should get send a request to create the pre_wutudu', function() {
      var pre_wutudu = {'pre_wutudu' : {
        'event_date' : '2015-10-31T07:00:00.000Z',
        'latitude' : '49.216317',
        'longitude' : '-122.9801535'
      }};
      var config = {
        groupId: '1',
        data: pre_wutudu
      };
      var expectedArgs = {
        method: 'POST',
        data: pre_wutudu,
        url: '/groups/1/pre_wutudu'
      };
      expect(createFn(config)).to.be.ok;
      expect($httpService.makeRequest.callCount).to.equal(1);
      expect($httpService.makeRequest.args[0][0])
        .to.deep.equal(expectedArgs);
    });
  });

  describe('When finishing Wutudus', function() {
    it('should get send a finish pre_wutudu request', function() {
      var config = {
        groupId: '1',
        wutuduId: '2'
      };
      var expectedArgs = {
        method: 'POST',
        url: '/groups/1/pre_wutudu/2/finish'
      };
      expect(finishFn(config)).to.be.ok;
      expect($httpService.makeRequest.callCount).to.equal(1);
      expect($httpService.makeRequest.args[0][0])
        .to.deep.equal(expectedArgs);
    });
  });

  describe('When answering Wutudus', function() {
    it('should get send a request with answers to the Wutudu', function() {
      var answers = {'user_answer' : {
        'answers': [0, 1, 2, 3, 0, 1, 2, 3, 0, 1]
      }};
      var config = {
        groupId: '1',
        wutuduId: '2',
        data: answers
      };
      var expectedArgs = {
        method: 'POST',
        data: answers,
        url: '/groups/1/pre_wutudu/2/answers'
      };
      expect(sendAnswersFn(config)).to.be.ok;
      expect($httpService.makeRequest.callCount).to.equal(1);
      expect($httpService.makeRequest.args[0][0])
        .to.deep.equal(expectedArgs);
    });
  });
});
