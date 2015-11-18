describe('WutuduCreateController', function() {
  var $controller,
      Wutudu,
      GoogleMap,
      MapAutocompleteBox;

  beforeEach(function() {
    module('starter');
    inject(function(_$controller_, _Wutudu_, _GoogleMap_, _MapAutocompleteBox_){
      // The injector unwraps the underscores (_) from around the parameter names when matching
      $controller = _$controller_;
      Wutudu = _Wutudu_;
      var returnPromise = function(response) {
        return {
          then: function (cb) {
            cb(response);
          }
        };
      };
      sinon.stub(Wutudu, 'createWutudu', function () {
        var response = {
          'data' : {
            'message' : 'PreWutudu Created',
            'pre_wutudu' : {
              completed_answers: 0,
              declined_answers: 0,
              event_date: "2015-11-12T08:00:00.000Z",
              finished: false,
              latitude: "49.2162798",
              longitude: "-122.9802097",
              pre_wutudu_id: 11,
              questions: null, // This is normally not null
              total_possible: 1,
              user_answer: null
            }
          }
        };
        return returnPromise(response);
      });

      GoogleMap = _GoogleMap_;
      sinon.stub(GoogleMap, 'initMap', function () { return false; });
      sinon.stub(GoogleMap, 'setMarkerPosition', function () { return false; });

      MapAutocompleteBox = _MapAutocompleteBox_;
      sinon.stub(MapAutocompleteBox, 'initAutocompleteBox', function () { return false; });
    });
    $stateParams = {
      groupId: '2',
    };
  });

  describe('On init', function() {
    var $scope, controller;

    beforeEach(function() {
      $scope = {};
      controller = $controller('WutuduCreateCtrl', {
        $scope: $scope, 
        $stateParams: $stateParams,
        GoogleMap: GoogleMap
      });
    });

    it('should init a Google Map', function() {
      expect(GoogleMap.initMap.callCount).to.equal(1);
    });

    it('should init the calendar objet', function() {
      expect($scope.datepickerObject).to.exist;
      expect($scope.datepickerObject.inputDate).to.exist;
    });
  });

  describe('On Create Wutudu press', function() {
    var $scope, controller;

    beforeEach(function() {
      $scope = {};
      controller = $controller('WutuduCreateCtrl', {
        $scope: $scope, 
        $stateParams: $stateParams,
        GoogleMap: GoogleMap
      });
    });

    it('should send a request to create a PreWutudu', function() {
      $scope.createWutudu({
        latitude: '49.2827',
        longitude: '-123.1207'
      });

      expect(Wutudu.createWutudu.callCount).to.equal(1);
    });
  });

  describe('On Google Map location change', function() {
    var $scope, controller;

    beforeEach(function() {
      $scope = {};
      controller = $controller('WutuduCreateCtrl', {
        $scope: $scope, 
        $stateParams: $stateParams,
        GoogleMap: GoogleMap
      });
    });

    it('should update the map marker', function() {
      $scope.locationChange({
        latitude: '49.2827',
        longitude: '-123.1207'
      });
      expect(GoogleMap.setMarkerPosition.callCount).to.equal(1);
    });
  });
});
