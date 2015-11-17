describe('GroupListController', function() {
  /*jshint expr: true*/ // for chai syntax, testing only
  var GROUPLIST_CTRL = 'GroupListCtrl',
      $controller,
      $rootScope,
      Group,
      Friend,
      $ionicModal;

  beforeEach(function() {
    module('starter');
    inject(function(_$controller_, _Group_, _Friend_, _$ionicModal_,
      $httpBackend, _$rootScope_){
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      Group = _Group_;
      Friend = _Friend_;
      $ionicModal = _$ionicModal_;
      $httpBackend.whenGET().respond({});

      var returnPromise = function(response) {
        return {
          then: function (cb) {
            cb(response);
          }
        };
      };

      sinon.stub(Friend, 'getFriends', function() {
        var response = {
          data: {
            'friendships' : {
              'friends' : [
                {'id' : 1, 'name' : 'a', 'email' : 'a@a.com'},
                {'id' : 2, 'name' : 'b', 'email' : 'b@b.com'}
              ],
              'sent_requests' : [],
              'received_requests' : []
            }
          }
        };
        return returnPromise(response);
      });
      sinon.stub($ionicModal, 'fromTemplateUrl', function() {
        var mockModal = {
          show: function() {},
          hide: function() {}
        };
        return returnPromise(mockModal);
      });
      sinon.stub(Group, 'addGroup', function (config) {
        var response = {
          data: {
            group: {
              id: config.groupId
            }
          }
        };
        return returnPromise(response);
      });
      sinon.stub(Group, 'removeGroup', function (config) {
        var response = {
          data: {
            group: {
              id: config.groupId
            }
          }
        };
        return returnPromise(response);
      });
      sinon.stub(Group, 'getAllGroups', function() {
        var response = {
          data: {
            groups : {
              'active_groups' : [
                {'id' : 1, 'name' : 'Group 1'},
              ],
              'pending_groups' : [
                {'id' : 2, 'name' : 'Group 2'},
                {'id' : 3, 'name' : 'Group 3'}
              ]
            }
          }
        };
        return returnPromise(response);
      });
      sinon.stub(Group, 'createGroup', function() {
        var response = {
          data: {
            'group': {
              'id' : 1,
              'name' : 'Group 1'
            }
          }
        };
        return returnPromise(response);
      });
    });
  });

  describe('On Group List Controller init', function() {
    var $scope;
    beforeEach(function() {
      $scope = $rootScope.$new();
      $controller(GROUPLIST_CTRL, { $scope: $scope });
      $scope.$emit('$ionicView.enter');
      $scope.$digest();
    });
    it('should get all groups', function() {
      expect(Group.getAllGroups.callCount).to.equal(1);
      expect($scope.activeGroups).to.to.have.length(1);
      expect($scope.pendingGroups).to.to.have.length(2);
    });
    it('should init modals', function() {
      expect($ionicModal.fromTemplateUrl.callCount).to.equal(1);
      expect($scope.modal).to.exist;
    });
  });

  describe('When accepted invitation', function() {
    var $scope;
    beforeEach(function() {
      $scope = $rootScope.$new();
      $controller(GROUPLIST_CTRL, { $scope: $scope });
      $scope.$emit('$ionicView.enter');
      $scope.$digest();
    });
    it('should add user to group when invitation is accepted', function() {
      var data = {
        groupId: $scope.pendingGroups[0].id
      };
      $scope.acceptInvitation(data.groupId);
      expect(Group.addGroup.callCount).to.equal(1);
      expect(Group.addGroup.args[0][0]).to.deep.equal(data);
      expect($scope.activeGroups).to.have.length(2);
      expect($scope.pendingGroups).to.have.length(1);
    });
  });

  describe('When declined invitation', function() {
    var $scope;
    beforeEach(function() {
      $scope = $rootScope.$new();
      $controller(GROUPLIST_CTRL, { $scope: $scope });
      $scope.$emit('$ionicView.enter');
      $scope.$digest();
    });
    it('should remove group from pending list when invitation is declined', function() {
      var data = {
        groupId: $scope.pendingGroups[0].id
      };
      $scope.declineInvitation(data.groupId);
      expect(Group.removeGroup.callCount).to.equal(1);
      expect(Group.removeGroup.args[0][0]).to.deep.equal(data);
      expect($scope.activeGroups).to.have.length(1);
      expect($scope.pendingGroups).to.have.length(1);
    });
  });

  describe('When leave group', function() {
    var $scope;
    beforeEach(function() {
      $scope = $rootScope.$new();
      $controller(GROUPLIST_CTRL, { $scope: $scope });
      $scope.$emit('$ionicView.enter');
      $scope.$digest();
    });
    it('should remove group from active list when leaving group', function() {
      var data = {
        groupId: $scope.activeGroups[0].id
      };
      $scope.leaveGroup(data.groupId);
      expect(Group.removeGroup.callCount).to.equal(1);
      expect(Group.removeGroup.args[0][0]).to.deep.equal(data);
      expect($scope.activeGroups).to.have.length(0);
      expect($scope.pendingGroups).to.have.length(2);
    });
  });

  describe('When showing create group modal', function(){
    var $scope;
    beforeEach(function() {
      $scope = $rootScope.$new();
      $controller(GROUPLIST_CTRL, { $scope: $scope });
      $scope.$emit('$ionicView.enter');
      $scope.$digest();
    });
    it('should setup data and friends', function() {
      $scope.showCreateGroup();
      expect($scope.data.createGroup.name).to.exist;
      expect($scope.data.friends).to.have.length(2);
      expect($scope.data.friendsInvited).to.have.length(0);
    });
  });

  describe('When creating group', function() {
    var $scope;
    beforeEach(inject(function(_$msgBox_) {
      $scope = $rootScope.$new();
      $controller(GROUPLIST_CTRL, { $scope: $scope });
      $scope.$emit('$ionicView.enter');
      $scope.$digest();
      sinon.stub(_$msgBox_, 'show', function(){});
    }));
    it('should not create group without name', function() {
      $scope.data.createGroup = {
        name: ''
      };
      $scope.createGroup();
      expect(Group.createGroup.callCount).to.equal(0);
    });
    it('should create group given name', function() {
      $scope.data.createGroup = {
        name: 'Group 1'
      };
      $scope.createGroup();
      expect(Group.createGroup.callCount).to.equal(1);
    });
    it('should create group given name, email', function() {
      $scope.data = {
        createGroup: {
          name: 'Group 1'
        },
        friendsInvited: [
          {'id' : 1, 'name' : 'a', 'email' : 'a@a.com'},
          {'id' : 2, 'name' : 'b', 'email' : 'b@b.com'}
        ]
      };
      $scope.createGroup();
      expect(Group.createGroup.callCount).to.equal(1);
    });
  });
});
