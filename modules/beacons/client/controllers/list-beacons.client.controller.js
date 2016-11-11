(function () {
  'use strict';

  angular
    .module('beacons')
    .controller('BeaconsListController', BeaconsListController);

  BeaconsListController.$inject = ['BeaconsService'];

  function BeaconsListController(BeaconsService) {
    var vm = this;

    vm.beacons = BeaconsService.query();
  }
}());
