const nock = require('nock');
const Address = require('../index.js');

describe('Address test suite', () => {
  const scope = nock('http://www.example.com')
  .get('/ShippingAPI.dll?API=Verify&XML=%3CAddressValidateRequest%20USERID=%2212345%22%3E%3CAddress%20ID=%220%22%3E' +
    '%3CAddress1%3E%3C/Address1%3E%3CAddress2%3E123%20main%20st%3C/Address2%3E%3CCity%3Etoledo%3C/City%3E%3CState' +
    '%3EOH%3C/State%3E%3CZip5%3E%3C/Zip5%3E%3CZip4%3E%3C/Zip4%3E%3C/Address%3E%3CAddress%20ID=%221%22%3E%3CAddress1' +
    '%3E%3C/Address1%3E%3CAddress2%3E123%20main%20st%3C/Address2%3E%3CCity%3Edayton%3C/City%3E%3CState%3EOH%3C' +
    '/State%3E%3CZip5%3E%3C/Zip5%3E%3CZip4%3E%3C/Zip4%3E%3C/Address%3E%3C/AddressValidateRequest%3E')
  .reply(200, '<?xml version="1.0" encoding="UTF-8"?><AddressValidateResponse><Address ID="0">' +
    '<Address2>123 MAIN ST</Address2><City>TOLEDO</City><State>OH</State><Zip5>43605</Zip5><Zip4/>' +
    '</Address><Address ID="1"><Address2>123 N MAIN ST</Address2><City>DAYTON</City><State>OH</State>' +
    '<Zip5>45402</Zip5><Zip4/></Address></AddressValidateResponse>')
  .get('/ShippingAPI.dll?API=Verify&XML=%3CAddressValidateRequest%20USERID=%2212345%22%3E%3CAddress%20ID=%220%22%3E' +
    '%3CAddress1%3E%3C/Address1%3E%3CAddress2%3E123%20main%20st%3C/Address2%3E%3CCity%3Etoledo%3C/City%3E%3CState' +
    '%3EOH%3C/State%3E%3CZip5%3E%3C/Zip5%3E%3CZip4%3E%3C/Zip4%3E%3C/Address%3E%3C/AddressValidateRequest%3E')
  .reply(200, '<?xml version="1.0" encoding="UTF-8"?><AddressValidateResponse><Address ID="0">' +
    '<Address2>123 MAIN ST</Address2><City>TOLEDO</City><State>OH</State><Zip5>43605</Zip5><Zip4/>' +
    '</Address></AddressValidateResponse>');

  const address = new Address({
    userId: '12345',
    baseUrl: 'http://www.example.com'
  });

  test('validate multiple address call', (done) => {
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
      done();
    });
  });

  test('validate single address call', (done) => {
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
      done();
    });
  });
});
