describe('GroupServices', function() {
  /*jshint expr: true*/ // for chai syntax, testing only
  var Group,
      $httpService,
      groupIdErr = /groupId/,
      groupEmailErr = /Email/,
      groupNameErr = /Name/,
      groupFn,
      inviteFn,
      addFn,
      removeFn,
      getAllFn,
      createFn;

  beforeEach(function() {
    module('starter');
    inject(function(_Group_, _$httpService_) {
      Group = _Group_;
      groupFn = Group.getGroup;
      inviteFn = Group.inviteFriends;
      addFn = Group.addGroup;
      removeFn = Group.removeGroup;
      getAllFn = Group.getAllGroups;
      createFn = Group.createGroup;
      $httpService = _$httpService_;
      sinon.stub($httpService, 'makeRequest', function() { return true;});
    });
  });

  describe('When getting group', function() {
    it('should throw an error if no group id', function() {
      var config = {};
      expect(function() {
        groupFn(config);
      }).to.throw(groupIdErr);
      expect($httpService.makeRequest.callCount).to.equal(0);
    });
    it('should get groups given group id', function() {
      var config = {
            groupId: 5
          },
          expectedArgs = {
            method: 'GET',
            url: '/groups/' + config.groupId
          };
      expect(groupFn(config)).to.be.ok;
      expect($httpService.makeRequest.callCount).to.equal(1);
      expect($httpService.makeRequest.args[0][0])
        .to.deep.equal(expectedArgs);
    });
  });

  describe('When inviting friends', function() {
    it('should throw an error if no group id', function() {
      var config = {};
      expect(function() {
        inviteFn(config);
      }).to.throw(groupIdErr);
      expect($httpService.makeRequest.callCount).to.equal(0);
    });
    it('should throw an error if no friend emails', function() {
      var config = {
            groupId : 2
          };
      expect(function() {
        inviteFn(config);
      }).to.throw(groupEmailErr);
      expect($httpService.makeRequest.callCount).to.equal(0);
      angular.merge(config, {
        emails: []
      });
      expect(function() {
        inviteFn(config);
      }).to.throw(groupEmailErr);
      expect($httpService.makeRequest.callCount).to.equal(0);
    });
    it('should invite friends given friends emails', function() {
      var config = {
            groupId : 2,
            emails: ['d@d.com']
          },
          expectedArgs = {
            method: 'POST',
            data: {
              group_user: {
                emails : config.emails
              }
            },
            url: '/groups/' + config.groupId + '/users'
          };
      expect(inviteFn(config)).to.be.ok;
      expect($httpService.makeRequest.callCount).to.equal(1);
      expect($httpService.makeRequest.args[0][0])
        .to.deep.equal(expectedArgs);
    });
  });

  describe('When adding group', function() {
    it('should throw an error if no group id', function() {
      var config = {};
      expect(function() {
        addFn(config);
      }).to.throw(groupIdErr);
      expect($httpService.makeRequest.callCount).to.equal(0);
    });
    it('should add group given group id', function() {
      var config = {
            groupId: 2
          },
          expectedArgs = {
            method: 'PUT',
            url: '/groups/' + config.groupId + '/users'
          };
      expect(addFn(config)).to.be.ok;
      expect($httpService.makeRequest.callCount).to.equal(1);
      expect($httpService.makeRequest.args[0][0])
        .to.deep.equal(expectedArgs);
    });
  });

  describe('When removing group', function() {
    it('should throw an error if no group id', function() {
      var config = {};
      expect(function() {
        removeFn(config);
      }).to.throw(groupIdErr);
      expect($httpService.makeRequest.callCount).to.equal(0);
    });
    it('should remove group given group id', function() {
      var config = {
            groupId: 2
          },
          expectedArgs = {
            method: 'DELETE',
            url: '/groups/' + config.groupId + '/users'
          };
      expect(removeFn(config)).to.be.ok;
      expect($httpService.makeRequest.callCount).to.equal(1);
      expect($httpService.makeRequest.args[0][0])
        .to.deep.equal(expectedArgs);
    });
  });

  describe('When getting all groups', function() {
    it('should get all the groups', function() {
      var expectedArgs = {
            method: 'GET',
            url: '/groups'
          };
      getAllFn();
      expect($httpService.makeRequest.callCount).to.equal(1);
      expect($httpService.makeRequest.args[0][0])
              .to.deep.equal(expectedArgs);
    });
  });

  describe('When creating group', function() {
    it('should throw an error if no group name', function() {
      var config = {};
      expect(function() {
        createFn(config);
      }).to.throw(groupNameErr);
      expect($httpService.makeRequest.callCount).to.equal(0);
    });
    it('should create group given group name', function() {
      var config = {
            name: 'abc'
          },
          expectedArgs = {
            method: 'POST',
            data: {
              group: {
                name: config.name,
                emails : config.emails
              }
            },
            url: '/groups'
          };
      expect(createFn(config)).to.be.ok;
      expect($httpService.makeRequest.callCount).to.equal(1);
      expect($httpService.makeRequest.args[0][0])
        .to.deep.equal(expectedArgs);
    });
    it('should create group given group name and empty emails', function() {
     var config = {
            name: 'abc',
            emails: []
          },
          expectedArgs = {
            method: 'POST',
            data: {
              group: {
                name: config.name,
                emails: config.emails
              }
            },
            url: '/groups'
          };
      expect(createFn(config)).to.be.ok;
      expect($httpService.makeRequest.callCount).to.equal(1);
      expect($httpService.makeRequest.args[0][0])
        .to.deep.equal(expectedArgs);
    });
    it('should create group given group name and emails', function() {
      var config = {
            name: 'abc',
            emails: ['d@d.com']
          },
          expectedArgs = {
            method: 'POST',
            data: {
              group: {
                name: config.name,
                emails: config.emails
              }
            },
            url: '/groups'
          };
      expect(createFn(config)).to.be.ok;
      expect($httpService.makeRequest.callCount).to.equal(1);
      expect($httpService.makeRequest.args[0][0])
        .to.deep.equal(expectedArgs);
    });
  });
});
