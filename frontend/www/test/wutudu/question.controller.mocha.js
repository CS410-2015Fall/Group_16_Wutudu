describe('WutuduQuestionController', function() {
  var $controller,
      Wutudu;

  beforeEach(function() {
    module('starter');
    inject(function(_$controller_, _Wutudu_, _$httpService_){
      // The injector unwraps the underscores (_) from around the parameter names when matching
      $controller = _$controller_;
      Wutudu = _Wutudu_;
      $httpService = _$httpService_;

      var returnPromise = function(response) {
        return {
          then: function (cb) {
            cb(response);
          }
        };
      };

      sinon.stub(Wutudu, 'sendAnswers', function () { 
        var response = {
          'data' : 'User Answer Saved'
        };
        return returnPromise(response);
      });
    });
  });

  describe('On send wutudu answers', function() {
    var $scope, controller;

    beforeEach(function() {
      $scope = {};
      controller = $controller('WutuduQuestionCtrl', { $scope: $scope });
    });

    it('should send the 10 selected answers if submitted', function() {
      $scope.answers = [0, 1, 2, 3, 0, 1, 2, 3, 0, 1];
      $scope.submitAnswers();

      expect(Wutudu.sendAnswers.callCount).to.equal(1);
    });

    it('should not a request if there are not 10 answers', function() {
      $scope.answers = [0, 1, 2, 3, -1, 1, 2, 3, 0, 1];
      $scope.submitAnswers();

      expect(Wutudu.sendAnswers.callCount).to.equal(0);
    });
  });
});
