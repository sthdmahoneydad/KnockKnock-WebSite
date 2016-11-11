(function () {
  'use strict';

  angular
    .module('beacons')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('beacons', {
        abstract: true,
        url: '/beacons',
        template: '<ui-view/>'
      })
      .state('beacons.list', {
        url: '',
        templateUrl: 'modules/beacons/client/views/list-beacons.client.view.html',
        controller: 'BeaconsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Beacons List'
        }
      })
      .state('beacons.create', {
        url: '/create',
        templateUrl: 'modules/beacons/client/views/form-beacon.client.view.html',
        controller: 'BeaconsController',
        controllerAs: 'vm',
        resolve: {
          beaconResolve: newBeacon
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Beacons Create'
        }
      })
      .state('beacons.edit', {
        url: '/:beaconId/edit',
        templateUrl: 'modules/beacons/client/views/form-beacon.client.view.html',
        controller: 'BeaconsController',
        controllerAs: 'vm',
        resolve: {
          beaconResolve: getBeacon
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Beacon {{ beaconResolve.name }}'
        }
      })
      .state('beacons.view', {
        url: '/:beaconId',
        templateUrl: 'modules/beacons/client/views/view-beacon.client.view.html',
        controller: 'BeaconsController',
        controllerAs: 'vm',
        resolve: {
          beaconResolve: getBeacon
        },
        data: {
          pageTitle: 'Beacon {{ beaconResolve.name }}'
        }
      });
  }

  getBeacon.$inject = ['$stateParams', 'BeaconsService'];

  function getBeacon($stateParams, BeaconsService) {
    return BeaconsService.get({
      beaconId: $stateParams.beaconId
    }).$promise;
  }

  newBeacon.$inject = ['BeaconsService'];

  function newBeacon(BeaconsService) {
    return new BeaconsService();
  }
}());
