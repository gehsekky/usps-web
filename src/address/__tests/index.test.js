const Address = require('../index.js');

describe('Address test suite', () => {
  const address = new Address({
    userId: '12345',
    baseUrl: 'https://secure.shippingapis.com'
  });

  test('validate multiple address call', () => {
    address.validate([{
      streetAddress1: '123 main st',
      city: 'toledo',
      state: 'OH'
    },{
      streetAddress1: '123 main st',
      city: 'dayton',
      state: 'OH'
    }])
    .then((validatedAddresses) => {
      let validatedAddress = validatedAddresses[0];
      expect(validatedAddress.streetAddress1).toBe('123 MAIN ST');
      expect(validatedAddress.zip5).toBe('43605');
      expect(validatedAddress.zip4).toBe('');

      validatedAddress = validatedAddresses[1];
      expect(validatedAddress.streetAddress1).toBe('123 N MAIN ST');
      expect(validatedAddress.zip5).toBe('45402');
      expect(validatedAddress.zip4).toBe('');
    });
  });

  test('validate single address call', () => {
    address.validate([{
      streetAddress1: '123 main st',
      city: 'toledo',
      state: 'OH'
    }])
    .then((validatedAddresses) => {
      const validatedAddress = validatedAddresses[0];
      expect(validatedAddress.streetAddress1).toBe('123 MAIN ST');
      expect(validatedAddress.zip5).toBe('43605');
      expect(validatedAddress.zip4).toBe('');
    });
  });
});
