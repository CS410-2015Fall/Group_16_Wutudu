describe('FriendListController', function() {
  var $controller,
      Friend;

  beforeEach(function() {
    module('starter');
    inject(function(_$controller_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
    });

    inject(function(_Friend_, _$httpService_) {
      Friend = _Friend_;
      getFn = Friend.getFriends;
      inviteFn = Friend.sendFriendRequest;
      acceptFn = Friend.acceptFriendRequest;
      removeFn = Friend.removeFriend;
      $httpService = _$httpService_;

      var returnPromise = {
        then: function () { return true; }
      };

      sinon.stub(Friend, 'getFriends', function () { 
        return returnPromise;
      });
      sinon.stub(Friend, 'sendFriendRequest', function () { 
        return returnPromise;
      });
      sinon.stub(Friend, 'acceptFriendRequest', function () { 
        return returnPromise;
      });
      sinon.stub(Friend, 'removeFriend', function () { 
        return returnPromise;
      });
    });
  });

  describe('On friend init', function() {
    var $scope, controller;

    beforeEach(function() {
      $scope = {
        $on: function(a,b) {}
      };
      controller = $controller('FriendListCtrl', { $scope: $scope });
    });

    it('should get friends list', function() {
      assert.isUndefined($scope.friends, 'Active Friends intially empty');
      assert.isUndefined($scope.sentRequests, 'Active Friends intially empty');
      assert.isUndefined($scope.receivedRequests, 'Active Friends intially empty');

      expect(Friend.getFriends.callCount).to.equal(1);
    });
  });

  describe('When adding friends', function() {
    var $scope, controller;

    beforeEach(function() {
      $scope = {
        $on: function(a,b) {}
      };
      controller = $controller('FriendListCtrl', { $scope: $scope });
    });

    it('should successfully send a friend request with valid email', function() {
      var validEmail = 'f1@gmail.com';
      $scope.data.friendToAdd = validEmail;
      $scope.addFriend();
      expect(Friend.sendFriendRequest.callCount).to.equal(1);
    });

    it('should not send a friend request with invalid email', function() {
      var validEmail = '';
      $scope.data.friendToAdd = validEmail;
      $scope.addFriend();
      expect(Friend.sendFriendRequest.callCount).to.equal(0);
    });
  });
});
