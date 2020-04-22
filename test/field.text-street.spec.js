const Chai = require('chai');
const assert = Chai.assert;
const Logger = require('logger');
const FieldTextStreet = require('../field/field-text-street').FieldTextEmail;


describe('text-email',  () => {
  let logger = new Logger({toConsole: false});
  logger.clear();

  it('valid', async () => {
    let f = new FieldTextEmail();
    let r = await f.convert('email', 'info@em-cultuur.nl', logger);
    assert.equal(r, 'info@em-cultuur.nl', 'nothing changed')
  });
  it('wrong layout', async () => {
    let f = new FieldTextEmail();
    let r = await f.convert('email', 'info@em-cultuur.n', logger);
    assert.equal(r, 'info@em-cultuur.n #import', 'set error');
    assert.isTrue(logger.hasWarnings(), 'got it wrong')
  });
});
