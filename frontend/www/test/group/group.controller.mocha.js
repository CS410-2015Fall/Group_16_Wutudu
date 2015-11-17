describe('GroupController', function() {
  /*jshint expr: true*/ // for chai syntax, testing only
  var GROUP_CTRL = 'GroupCtrl',
      $controller,
      $rootScope,
      Group,
      Friend,
      Wutudu,
      $ionicModal;

  beforeEach(function() {
    module('starter');
    inject(function(_$controller_, _Group_, _Friend_, _Wutudu_, _$ionicModal_,
     $httpBackend, _$rootScope_){
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      Friend = _Friend_;
      Group = _Group_;
      Wutudu = _Wutudu_;
      $ionicModal = _$ionicModal_;
      $httpBackend.whenGET().respond({});

      var returnPromise = function(response) {
        return {
          then: function (cb) {
            cb(response);
          }
        };
      };

      sinon.stub($ionicModal, 'fromTemplateUrl', function() {
        var mockModal = {
          show: function() {},
          hide: function() {}
        };
        return returnPromise(mockModal);
      });
      sinon.stub(Friend, 'getFriends', function() {
        var response = {
          data: {
            'friendships' : {
              'friends' : [
                {'id' : 1, 'name' : 'a', 'email' : 'a@a.com', 'invited': true},
                {'id' : 2, 'name' : 'b', 'email' : 'b@b.com'}
              ],
              'sent_requests' : [],
              'received_requests' : []
            }
          }
        };
        return returnPromise(response);
      });
      sinon.stub(Group, 'getGroup', function(config) {
        var response = {
          data: {
            group_users: {
              active_users: [],
              pending_users: []
            },
            pre_wutudus: {},
            wutudu_events: {}
          }
        };
        return returnPromise(response);
      });
      sinon.stub(Wutudu, 'finishWutudu', function() {
        var response = {
          data: {
            wutudu_event: {}
          }
        };
        return returnPromise(response);
      });
      sinon.stub(Group, 'inviteFriends', function() {
        var response = {
          data: {}
        };
        return returnPromise(response);
      });
    });
  });

  describe('On Group Controller init', function() {
    var $scope;
    beforeEach(function() {
      $scope = $rootScope.$new();
      $controller(GROUP_CTRL, { $scope: $scope });
      $scope.$emit('$ionicView.enter');
      $scope.$digest();
    });
    it('should get the group info', function() {
      expect(Group.getGroup.callCount).to.equal(1);
      expect($scope.activeMembers).to.have.length(0);
      expect($scope.pendingMembers).to.have.length(0);
      expect($scope.inProgressWutudus).to.have.length(0);
      expect($scope.wutuduEvents).to.have.length(0);
    });
    it('should init modals', function() {
      expect($ionicModal.fromTemplateUrl.callCount).to.equal(1);
      expect($scope.modal).to.exist;
    });
  });

  describe('When adding friend to group', function() {
    var $scope;
    beforeEach(inject(function(_$msgBox_, _$ionicPopup_) {
      $scope = $rootScope.$new();
      $controller(GROUP_CTRL, { $scope: $scope });
      $scope.$emit('$ionicView.enter');
      $scope.$digest();
      sinon.stub(_$msgBox_, 'show', function(){});
      sinon.stub(_$ionicPopup_, 'show', function() {});
    }));
    it('should show friends in pending invitations after adding them', function(){
      expect($scope.pendingMembers).to.have.length(0);
      $scope.showAddFriend();
      $scope.addFriendToGroup();
      expect($scope.pendingMembers).to.have.length(1);
    });
    it('should not add friends who are already friend', function() {
      $scope.showAddFriend();
      $scope.addFriendToGroup();
      expect($scope.pendingMembers).to.have.length(1);
      $scope.showAddFriend();
      var invitedFriend = {
        'id' : 1,
        'name' : 'a',
        'email' : 'a@a.com',
        'invited': true
      };
      expect($scope.data.friends).to.not.include(invitedFriend);
    });
  });

  describe('When showing current prewutudu', function() {
    var $scope;
    beforeEach(function() {
      $scope = $rootScope.$new();
      $controller(GROUP_CTRL, { $scope: $scope });
      $scope.$emit('$ionicView.enter');
      $scope.$digest();
    });
    it('should get the current prewutudu', function() {
      expect($scope.activePreWutudu).to.not.exist;
      var mockPrewutudu = {};
      $scope.showPreWutuduOptions(mockPrewutudu);
      expect($scope.activePreWutudu).to.exist;
    });
    it('should display the preWutudu\'s status', function() {
      var mockPrewutudu = null,
          status = $scope.displayStatus(mockPrewutudu);
      expect(status).to.be.empty;
      mockPrewutudu = {};
      status = $scope.displayStatus(mockPrewutudu);
      expect(status).to.not.be.empty;
    });
    it('should know if user has answered preWutudu', function() {
      var mockPrewutudu = null,
          hasAnswered = $scope.userAnswered(mockPrewutudu);
      expect(hasAnswered).to.be.false;
      mockPrewutudu = {};
      hasAnswered = $scope.userAnswered(mockPrewutudu);
      expect(hasAnswered).to.be.false;
      mockPrewutudu = {
        user_answer: 'Answered'
      };
      hasAnswered = $scope.userAnswered(mockPrewutudu);
      expect(hasAnswered).to.be.true;
    });
    it('should display if preWutudu has been answered', function() {
      var mockPrewutudu = null,
          answer = $scope.answeredStateString(mockPrewutudu);
      expect(answer).to.be.equal('Unanswered');
      mockPrewutudu = {};
      answer = $scope.answeredStateString(mockPrewutudu);
      expect(answer).to.be.equal('Unanswered');
      mockPrewutudu = {
        user_answer: {
          declined: true
        }
      };
      answer = $scope.answeredStateString(mockPrewutudu);
      expect(answer).to.be.equal('Declined');
      mockPrewutudu = {
        user_answer: {
          declined: false
        }
      };
      answer = $scope.answeredStateString(mockPrewutudu);
      expect(answer).to.be.equal('Answered');
    });
    it('should handle finishing of preWutudu', function() {
      expect($scope.wutuduEvents).to.have.length(0);
      var mockPrewutudu = {
        pre_wutudu_id: 1
      };
      $scope.finishPreWutudu(mockPrewutudu);
      expect($scope.wutuduEvents).to.have.length(1);
    });
    it('should end prewutudu correctly', function() {
      var mockPrewutudu = null,
          result = $scope.canEndPreWutudu(mockPrewutudu);
      expect(result).to.be.false;
      mockPrewutudu = {
        completed_answers: 1
      };
      result = $scope.canEndPreWutudu(mockPrewutudu);
      expect(result).to.be.true;
    });
  });

});
