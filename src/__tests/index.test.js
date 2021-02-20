const USPSWeb = require('../index.js');

describe('USPSWeb test suite', () => {
  test('validate address call', () => {
    USPSWeb.address.validate({
      streetAddress1: '1600 pennsylvania ave nw',
      city: 'washington',
      state: 'dc'
    })
    .then((validatedAddress) => {
      expect(validatedAddress.streetAddress1).toBe('1600 PENNSYLVANIA AVE NW');
      expect(validatedAddress.zip5).toBe('20500');
      expect(validatedAddress.zip4).toBe('0005');
    });
  });
});
