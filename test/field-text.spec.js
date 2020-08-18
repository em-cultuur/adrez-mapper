const Chai = require('chai');
const assert = Chai.assert;
const _ = require('lodash');
const Logger = require('logger');
const FieldGuid = require('../field/field-text').FieldTextGuid;



describe('field-guid',  () => {
  let logger = new Logger({toConsole: false});

  let f = new FieldGuid();
  it('text', async () => {
    let r = await f.convert('guid','txt', logger);
    assert.equal(r, 'txt')
  });
  it('number', async () => {
    let r = await f.convert('guid','1234', logger);
    assert.equal(r, 1234)
  });

});
