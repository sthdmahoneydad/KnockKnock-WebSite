(function () {
  'use strict';

  // Beacons controller
  angular
    .module('beacons')
    .controller('BeaconsController', BeaconsController);

  BeaconsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'beaconResolve'];

  function BeaconsController ($scope, $state, $window, Authentication, beacon) {
    var vm = this;

    vm.authentication = Authentication;
    vm.beacon = beacon;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Beacon
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.beacon.$remove($state.go('beacons.list'));
      }
    }

    // Save Beacon
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.beaconForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.beacon._id) {
        vm.beacon.$update(successCallback, errorCallback);
      } else {
        vm.beacon.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('beacons.view', {
          beaconId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
