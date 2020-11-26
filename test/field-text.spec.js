const Chai = require('chai');
const assert = Chai.assert;
const _ = require('lodash');
const Logger = require('logger');
const FieldText = require('../field/field-text').FieldText;
const FieldGuid = require('../field/field-text').FieldTextGuid;



describe('field-text', () => {
  let logger = new Logger({toConsole: false});


  it('text' , async () => {
    let f = new FieldText();
    let r = await f.convert('text','text', logger);
    assert.equal(r, 'text')
  });

  it('validate', async() => {
    logger.clear();
    let f = new FieldText({validValues: ['yes', 'no']});
    let r = await f.convert('text','yes', logger);
    assert.equal(r, 'yes')
    assert.isFalse(logger.hasMessages());
    r = await f.convert('text','wrong', logger);
    assert.isTrue(logger.hasMessages());
    assert.isUndefined(r);
  })

  it('casInsensitive', async() => {
    logger.clear();
    let f = new FieldText({validValues: ['YES', 'no'], isCaseInsensitive: true});
    let r = await f.convert('text','yes', logger);
    assert.equal(r, 'yes')
    assert.isFalse(logger.hasMessages());
  })

  it('one value', async() => {
    logger.clear();
    let f = new FieldText({validValues: 'YES', isCaseInsensitive: true});
    let r = await f.convert('text','yes', logger);
    assert.equal(r, 'yes')
    assert.isFalse(logger.hasMessages());
    r = await f.convert('text','no', logger);
    assert.isUndefined(r)
    assert.isFalse(logger.hasMessages());
  })
})

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
