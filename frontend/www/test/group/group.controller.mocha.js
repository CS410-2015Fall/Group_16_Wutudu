describe('GroupListController', function() {
  var $controller;

  beforeEach(function() {
    module('starter');
    inject(function(_$controller_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
    });
  });

  describe('$scope.activeGroups', function() {
    var $scope, controller;

    beforeEach(function() {
      $scope = {
        $on: function(a,b){}
      };
      controller = $controller('GroupListCtrl', { $scope: $scope });
    });

    it('sets the activeGroups', function() {
      assert.isUndefined($scope.activeGroups, 'Active Group intially empty');
    });

  });
});
