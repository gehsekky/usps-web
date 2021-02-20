const xmljs = require('xml-js');
const fetch = require('node-fetch');

class Address {
  constructor(uspsWebContext) {
    this.uspsWeb = uspsWebContext;
  }

  /**
   * validates address
   * @param {object} address
   */
  validate(addresses) {
    const query = {
      AddressValidateRequest: {
        _attributes: {
          USERID: this.uspsWeb.userId
        },
        Address: []
      }
    };

    if (!Array.isArray(addresses)) {
      addresses = [addresses];
    }

    for (let addressCounter = 0; addressCounter < addresses.length; addressCounter++) {
      const address = addresses[addressCounter];
      query.AddressValidateRequest.Address.push({
        _attributes: {
          ID: `${addressCounter}`
        },
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
      })
    }

    const queryOptions = {
      compact: true,
      fullTagEmptyElement: true,
      ignoreDeclaration: true,
      ignoreDoctype: true
    };

    return fetch(this.uspsWeb.baseUrl + '/ShippingAPI.dll?API=Verify&XML=' + xmljs.js2xml(query, queryOptions))
    .then((raw) => raw.text())
    .then((xml) => {
      const response = xmljs.xml2js(xml, {
        compact: true,
        ignoreDeclaration: true
      });

      let responseAddresses = response.AddressValidateResponse.Address;
      if (!Array.isArray(responseAddresses)) {
        responseAddresses = [responseAddresses];
      }

      const validatedAddresses = [];
      for (const validatedAddress of responseAddresses) {
        validatedAddresses.push({
          streetAddress1: validatedAddress.Address2._text,
          streetAddress2: validatedAddress.Address1 ? validatedAddress.Address1._text : '',
          city: validatedAddress.City._text,
          state: validatedAddress.State._text,
          zip5: validatedAddress.Zip5._text,
          zip4: validatedAddress.Zip4._text || ''
        });
      }

      return validatedAddresses;
    })
    .catch((err) => {
      console.error(err);
      return err;
    })
  }
}

module.exports = Address;
