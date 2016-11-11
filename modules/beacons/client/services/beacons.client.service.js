// Beacons service used to communicate Beacons REST endpoints
(function () {
  'use strict';

  angular
    .module('beacons')
    .factory('BeaconsService', BeaconsService);

  BeaconsService.$inject = ['$resource'];

  function BeaconsService($resource) {
    return $resource('api/beacons/:beaconId', {
      beaconId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
