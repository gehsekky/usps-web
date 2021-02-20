const xmljs = require('xml-js');
const fetch = require('node-fetch');
const config = require('config');

class Address {
  /**
   * validates address
   * @param {object} address
   */
  static validate(address) {
    const query = {
      AddressValidateRequest: {
        _attributes: {
          USERID: config.get('userId')
        },
        Address: {
          Address1: {
            _text: address.streetAddress2 || ''
          },
          Address2: {
            _text: address.streetAddress1
          },
          City: {
            _text: address.city
          },
          State: {
            _text: address.state
          },
          Zip5: {
            _text: address.zip5 || ''
          },
          Zip4: {
            _text: address.zip4 || ''
          }
        }
      }
    };

    const queryOptions = {
      compact: true,
      fullTagEmptyElement: true,
      ignoreDeclaration: true,
      ignoreDoctype: true
    };

    return fetch(config.get('usps.baseUrl') + '/ShippingAPI.dll?API=Verify&XML=' + xmljs.js2xml(query, queryOptions))
    .then((raw) => raw.text())
    .then((xml) => {
      const validatedAddress = xmljs.xml2js(xml, {
        compact: true,
        ignoreDeclaration: true
      });

      return {
        streetAddress1: validatedAddress.AddressValidateResponse.Address.Address2._text,
        streetAddress2: validatedAddress.AddressValidateResponse.Address.Address1 ? validatedAddress.AddressValidateResponse.Address.Address1._text : '',
        city: validatedAddress.AddressValidateResponse.Address.City._text,
        state: validatedAddress.AddressValidateResponse.Address.State._text,
        zip5: validatedAddress.AddressValidateResponse.Address.Zip5._text,
        zip4: validatedAddress.AddressValidateResponse.Address.Zip4._text
      };
    })
    .catch((err) => {
      console.error(err);
      return err;
    })
  }
}

module.exports = Address;
