describe('FriendListController', function() {
  var FRIENDLIST_CTRL = 'FriendListCtrl',
      $controller,
      $rootScope,
      Friend;

  beforeEach(function() {
    module('starter');
    inject(function(_$controller_, _Friend_, $httpBackend, _$rootScope_){
      // The injector unwraps the underscores (_) from around the parameter names when matching
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      Friend = _Friend_;
      $httpBackend.whenGET().respond({});

      var returnPromise = function(response) {
        return {
          then: function (cb) {
            cb(response);
          }
        };
      };

      sinon.stub(Friend, 'getFriends', function () {
        var response = {
          'data' : {
            'friendships' : {
              'friends' : [
                {'id' : 1, 'name' : 'a', 'email' : 'a@a.com'},
                {'id' : 2, 'name' : 'b', 'email' : 'b@b.com'}
              ],
              'sent_requests' : [
                {'id' : 3, 'name' : 'c', 'email' : 'c@c.com'}
              ],
              'received_requests' : [
                {'id' : 4, 'name' : 'd', 'email' : 'd@d.com'}
              ]
            }
          }
        };
        return returnPromise(response);
      });
      sinon.stub(Friend, 'sendFriendRequest', function () {
        var response = {
          'data' : 'Friend Request Sent'
        };
        return returnPromise(response);
      });
      sinon.stub(Friend, 'acceptFriendRequest', function () {
        var response = {
          'data' : 'Friend Accepted'
        };
        return returnPromise(response);
      });
      sinon.stub(Friend, 'removeFriend', function () {
        var response = {
          'data' : 'Unfriended'
        };
        return returnPromise(response);
      });
    });
  });

  describe('On friend init', function() {
    var $scope;

    beforeEach(function() {
      $scope = $rootScope.$new();
      $controller(FRIENDLIST_CTRL, { $scope: $scope });
      $scope.$emit('$ionicView.enter');
      $scope.$digest();
    });

    it('should get friends list', function() {
      expect(Friend.getFriends.callCount).to.equal(1);
      expect($scope.friends.length).to.equal(2);
      expect($scope.sentRequests.length).to.equal(1);
      expect($scope.receivedRequests.length).to.equal(1);
    });
  });

  describe('When adding friends', function() {
    var $scope;

    beforeEach(function() {
      $scope = $rootScope.$new();
      $controller(FRIENDLIST_CTRL, { $scope: $scope });
      $scope.$emit('$ionicView.enter');
      $scope.$digest();
    });

    it('should successfully send a friend request with valid email', function() {
      expect($scope.sentRequests.length).to.equal(1);

      var validEmail = 'f1@gmail.com';
      $scope.data.friendToAdd = validEmail;
      $scope.addFriend();

      expect(Friend.sendFriendRequest.callCount).to.equal(1);
      expect($scope.sentRequests.length).to.equal(2);
    });

    it('should not send a friend request with blank email', function() {
      expect($scope.sentRequests.length).to.equal(1);

      var invalidEmail = '';
      $scope.data.friendToAdd = invalidEmail;
      $scope.addFriend();

      expect(Friend.sendFriendRequest.callCount).to.equal(0);
      expect($scope.sentRequests.length).to.equal(1);
    });

    it('should not send a friend request with invalid email', function() {
      expect($scope.sentRequests.length).to.equal(1);

      // An input of type email will resolve to undefined if an invalid email is entered
      $scope.data.friendToAdd = undefined;
      $scope.addFriend();

      expect(Friend.sendFriendRequest.callCount).to.equal(0);
      expect($scope.sentRequests.length).to.equal(1);
    });
  });

  describe('When accepting friend requests', function() {
    var $scope;

    beforeEach(function() {
      $scope = $rootScope.$new();
      $controller(FRIENDLIST_CTRL, { $scope: $scope });
      $scope.$emit('$ionicView.enter');
      $scope.$digest();
    });

    it('should successfully send an accept friend request with valid email', function() {
      var validFriendRequest = {'id' : 4, 'name' : 'd', 'email' : 'd@d.com'};
      expect($scope.receivedRequests[0]).to.deep.equal(validFriendRequest);
      expect($scope.friends).to.have.length(2);

      $scope.acceptFriend(validFriendRequest);

      expect(Friend.acceptFriendRequest.callCount).to.equal(1);
      expect($scope.receivedRequests).to.have.length(0);
      expect($scope.friends).to.have.length(3);
    });
  });

  describe('When declining/removing requests', function() {
    var $scope;

    beforeEach(function() {
      $scope = $rootScope.$new();
      $controller(FRIENDLIST_CTRL, { $scope: $scope });
      $scope.$emit('$ionicView.enter');
      $scope.$digest();
    });

    it('should successfully remove a friend with valid email', function() {
      var validFriend = {'id' : 1, 'name' : 'a', 'email' : 'a@a.com'};
      expect($scope.friends[0]).to.deep.equal(validFriend);
      expect($scope.friends).to.have.length(2);

      $scope.doRemoveFriend(validFriend, 'remove');

      expect(Friend.removeFriend.callCount).to.equal(1);
      expect($scope.friends).to.have.length(1);
    });

    it('should successfully decline a friend request with valid email', function() {
      var validFriendRequest = {'id' : 4, 'name' : 'd', 'email' : 'd@d.com'};
      expect($scope.receivedRequests[0]).to.deep.equal(validFriendRequest);

      $scope.doRemoveFriend(validFriendRequest, 'remove');

      expect(Friend.removeFriend.callCount).to.equal(1);
      expect($scope.receivedRequests).to.have.length(0);
    });

    it('should successfully decline a friend invite with valid email', function() {
      var validFriendInvite = {'id' : 3, 'name' : 'c', 'email' : 'c@c.com'};
      expect($scope.sentRequests[0]).to.deep.equal(validFriendInvite);

      $scope.doRemoveFriend(validFriendInvite, 'invite');

      expect(Friend.removeFriend.callCount).to.equal(1);
      expect($scope.sentRequests).to.have.length(0);
    });
  });
});
