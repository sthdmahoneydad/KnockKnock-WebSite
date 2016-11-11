'use strict';

describe('Beacons E2E Tests:', function () {
  describe('Test Beacons page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/beacons');
      expect(element.all(by.repeater('beacon in beacons')).count()).toEqual(0);
    });
  });
});
