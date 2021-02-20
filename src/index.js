const Address = require('./address');

/**
 * main class for USPS webtools API
 */
class USPSWeb {
  constructor(config) {
    this.userId = config.userId;
    this.baseUrl = config.baseUrl;
    this.address = new Address(this);
  }
}

module.exports = USPSWeb;
