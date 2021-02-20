const USPSWeb = require('../index.js');

describe('USPSWeb test suite', () => {
  test('instantiates', () => {
    expect(new USPSWeb({ userId: '12345', baseUrl: '12345' })).toBeTruthy();
  });
});
