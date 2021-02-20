# usps-web
a nodejs wrapper for the USPS webtools API

written with nodejs v12.18.1

## how to install for local development

* clone repo locally
* in root dir, type

        npm install

## how to use

    const USPSWeb = require('usps-web');
    const uspsWeb = new USPSWeb({
      userId: '12345',
      baseUrl: 'usps url goes here'
    })

    USPSWeb.address.validate({
      streetAddress1: '1600 pennsylvania ave',
      city: 'washington',
      state: 'dc'
    }).then((results) => {
      for (const result of results) {
        console.log(result);
      }
    });
