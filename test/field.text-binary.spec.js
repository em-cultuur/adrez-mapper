const Chai = require('chai');
const assert = Chai.assert;
const _ = require('lodash');
const Logger = require('logger');

const FieldBinary = require('../field/field-text-binary').FieldTextBinary



describe('text-binary',  () => {
  let logger = new Logger({toConsole: false});

  it('empty', async () => {
    let f = new FieldBinary({value: {'add': 1, 'update': 2, 'delete': 4}});
    logger.clear();
    let r = await f.convert('values', '', logger);
    assert.equal(r, 0)
  });

  it('add', async () => {
    let f = new FieldBinary({values: {'add': 1, 'update': 2, 'delete': 4}});
    logger.clear();
    let r = await f.convert('value', 'add', logger);
    assert.equal(r, 1)
  });

  it('update', async () => {
    let f = new FieldBinary({values: {'add': 1, 'update': 2, 'delete': 4}});
    logger.clear();
    let r = await f.convert('value', 'update', logger);
    assert.equal(r, 2)
  });

  it('combine', async () => {
    let f = new FieldBinary({values: {'add': 1, 'update': 2, 'delete': 4}});
    logger.clear();
    let r = await f.convert('value', 'add, update', logger);
    assert.equal(r, 3)
  });

  it('array', async () => {
    let f = new FieldBinary({values: {'add': 1, 'update': 2, 'delete': 4}});
    logger.clear();
    let r = await f.convert('value', ['add', 'update'], logger);
    assert.equal(r, 3)
  });

  it('value', async () => {
    let f = new FieldBinary({values: {'add': 1, 'update': 2, 'delete': 4}});
    logger.clear();
    let r = await f.convert('value', 3,  logger);
    assert.equal(r, 3)
  });

  it('error', async () => {
    let f = new FieldBinary({values: {'add': 1, 'update': 2, 'delete': 4}});
    logger.clear();
    let r = await f.convert('value', 'notFound',  logger);
    assert.isTrue(logger.hasErrors())
    assert.equal(logger.errors[0].fieldName, 'unknown value "notFound". allowed are: add,update,delete')
  });

});
