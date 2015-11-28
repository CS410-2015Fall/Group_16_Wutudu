describe('WutuduDetailsController', function() {
  var $controller,
      Wutudu,
      GoogleMap;

  beforeEach(function() {
    module('starter');
    inject(function(_$controller_, _GoogleMap_){
      // The injector unwraps the underscores (_) from around the parameter names when matching
      $controller = _$controller_;
      GoogleMap = _GoogleMap_;
      sinon.stub(GoogleMap, 'initMap', function () { return false; });
    });
    $stateParams = {
      groupId: '2',
      wutudu: {
        accepted_users: [{
          email: 'f1@gmail.com',
          id: 5,
          name: 'Friend1'
        }],
        category: {
          cat_id: 1,
          name: 'Active Life'
        },
        display_date: 'Sat Oct 31 2015 ',
        event_details: {
          categories: 'Coffee & Tea, Tea Rooms',
          location: {
            address: '104-6888 Royal Oak Avenue Burnaby, BC V5J 4J2 Canada',
            lat: 49.2208405,
            long: -122.9884644
          },
          name: 'Camellia Tea & Coffee',
          phone_number: '+1-604-428-6511',
          rating: {
            count: 45,
            value: 4
          },
          yelp_url: 'http://www.yelp.com/biz/camellia-tea-and-coffee-burnaby'
        },
        event_time: '2015-11-12T08:00:00.000Z',
        id: 1,
        latitude: '49.216317',
        longitude: '-122.9801535',
        pre_wutudu_id: 4
      },
      wutuduId: '1'
    };
  });

  describe('On init', function() {
    var $scope, controller;

    beforeEach(function() {
      $scope = $rootScope.$new();
      controller = $controller('WutuduDetailsCtrl', {
        $scope: $scope, 
        $stateParams: $stateParams,
        GoogleMap: GoogleMap
      });
      $scope.$emit('$ionicView.enter');
      $scope.$digest();
    });

    it('should format the date of the Wutudu', function() {
      expect($scope.wutudu).to.be.exist;
      expect($scope.wutudu.display_date).to.exist;
    });

    it('should not init a Google Map on load', function() {
     expect(GoogleMap.initMap.callCount).to.equal(0);
    });

  });

  describe('On Show map button click', function() {
    var $scope, controller;

    beforeEach(function() {
      $scope = $rootScope.$new();
      controller = $controller('WutuduDetailsCtrl', {
        $scope: $scope, 
        $stateParams: $stateParams,
        GoogleMap: GoogleMap
      });
      $scope.$emit('$ionicView.enter');
      $scope.$digest();

      $scope.modal = {
        show: function () { return true }
      };
    });

    it('should init a Google Map on Show Map button click', function() {
      $scope.expandMap();
      expect(GoogleMap.initMap.callCount).to.equal(1);
    });
  });
});
