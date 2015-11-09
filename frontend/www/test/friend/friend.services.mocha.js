describe('FriendServices', function() {
  /*jshint expr: true*/ // for chai syntax, testing only
  var friend,
      $httpService,
      getFn,
      inviteFn,
      acceptFn,
      removeFn;

  beforeEach(function() {
    module('starter.services');
    inject(function(_Friend_, _$httpService_) {
      friend = _Friend_;
      getFn = friend.getFriends;
      inviteFn = friend.sendFriendRequest;
      acceptFn = friend.acceptFriendRequest;
      removeFn = friend.removeFriend;
      $httpService = _$httpService_;
      sinon.stub($httpService, 'makeRequest', function() { return true;});
    });
  });

  describe('When getting friends', function() {
    it('should get friends for the user', function() {
      var expectedArgs = {
            method: 'GET',
            url: '/friends'
          };
      expect(getFn()).to.be.ok;
      expect($httpService.makeRequest.callCount).to.equal(1);
      expect($httpService.makeRequest.args[0][0])
        .to.deep.equal(expectedArgs);
    });
  });
});
