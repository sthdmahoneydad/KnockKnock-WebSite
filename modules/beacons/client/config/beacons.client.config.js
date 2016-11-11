(function () {
  'use strict';

  angular
    .module('beacons')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Beacons',
      state: 'beacons',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'beacons', {
      title: 'List Beacons',
      state: 'beacons.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'beacons', {
      title: 'Create Beacon',
      state: 'beacons.create',
      roles: ['user']
    });
  }
}());
