const Chai = require('chai');
const assert = Chai.assert;
const Logger = require('logger');
const FieldTextTelephone = require('../field/field-text-telephone').FieldTextTelephone;


describe('text-telephone',  () => {
  let logger = new Logger({toConsole: false});
  logger.clear();

  it('valid', async () => {
    let f = new FieldTextTelephone();
    let r = await f.convert('telephone', '020-6253215', logger);
    assert.equal(r, '020-6253215', 'nothing changed')
  });
  it('international', async () => {
    let f = new FieldTextTelephone({ countryCode: '+31'});
    let r = await f.convert('telephone', '020-6253215', logger);
    assert.equal(r, '+31 (20) 6253215', 'changed to international')
  });
  it('too long', async () => {
    let f = new FieldTextTelephone();
    let r = await f.convert('telephone', '020-6253215 is too long', logger);
    assert.equal(r, '020-6253215 is too long', 'nothing changed')
    assert.equal(logger.hasWarnings(), true, 'has an error');
    logger.clear();
  });


});
