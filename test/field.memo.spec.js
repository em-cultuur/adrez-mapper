const Chai = require('chai');
const assert = Chai.assert;
const _ = require('lodash');
const Logger = require('logger');
const Lookup = require('../lib/lookup');
const FieldMemo = require('../field/field-memo').FieldMemo;

describe('field.memo', () => {

  let logger = new Logger({toConsole: false});

  LookupMemo = class {
    memo(fieldName, def) {
      return Promise.resolve(def.parentIdDefault);
    }
  };

  describe('empty', async () => {
    let f = new FieldMemo({lookup: new LookupMemo()});
    let r = await f.convert('memo', {}, logger);
    assert.isUndefined(r.text, 'no text: so empty');
    assert.isUndefined(r.description, 'no text');
    assert.isUndefined(r.useDescription, 'empty so removed');
  });

  describe('text',  () => {
    let f = new FieldMemo({lookup: new LookupMemo()});
    logger.clear();
    it('auto set', async () => {
      let r = await f.convert('memo', { text: 'use text'}, logger);
      assert.equal(r.text, 'use text', 'set the value');
      assert.isUndefined(r.description, 'no description');
      assert.equal(r.useDescription, 0, 'use the text');
    });
    it('no value', async () => {
      let r = await f.convert('memo', {}, logger);
      assert.isUndefined(r.text, 'no value');
      assert.isUndefined(r.description, 'no description');
      assert.isUndefined(r.useDescription,  'no use');
    });
  });
  describe('description',  () => {
    let f = new FieldMemo({lookup: new LookupMemo()});
    logger.clear();
    it('auto set', async () => {
      let r = await f.convert('memo', {description: 'use text'}, logger);
      assert.equal(r.description, 'use text', 'set the value');
      assert.isUndefined(r.text, 'no text');
      assert.equal(r.useDescription, 1, 'use the description');
    });
  });
  describe('select field',  () => {
    let f = new FieldMemo({lookup: new LookupMemo()});
    logger.clear();
    it('description is most important', async () => {
      let r = await f.convert('memo', {description: 'use description', text: 'use text'}, logger);
      assert.equal(r.description, 'use description', 'set the value');
      assert.isUndefined(r.text, 'no text');
      assert.equal(r.useDescription, 1, 'use the description');
    });
    it('force field', async () => {
      let r = await f.convert('memo', {useDescription: false, description: 'use description', text: 'use text'}, logger);
      assert.equal(r.text, 'use text', 'set the value');
      assert.isUndefined(r.description, 'no text');
      assert.equal(r.useDescription, 0, 'use the description');
    });
    it('description is most important', async () => {
      let r = await f.convert('memo', {useDescription: true, description: 'use description', text: 'use text'}, logger);
      assert.equal(r.description, 'use description', 'set the value');
      assert.isUndefined(r.text, 'no text');
      assert.equal(r.useDescription, 1, 'use the description');
    });

    it('force field - empty', async () => {
      let r = await f.convert('memo', {useDescription: false, description: 'use description'}, logger);
      assert.isUndefined(r.text, 'no text: so empty');
      assert.isUndefined(r.description, 'no text');
      assert.isUndefined(r.useDescription, 'empty so removed');
    });

  });
});
