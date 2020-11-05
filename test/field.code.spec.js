const Chai = require('chai');
const assert = Chai.assert;
const _ = require('lodash');
const Logger = require('logger');
const Lookup = require('../lib/lookup');
const FieldCode = require('../field/field-code').FieldCode;
const CODE_TYPE_CODE = require('../field/field-code').FIELD_GROUP_TYPE_CODE;
const Record = require('../field/record').AdrezRecord;

describe('field.code', () => {

  let logger = new Logger({toConsole: false});

  class LookupCode {
    async code(fieldName, def) {
      switch(def.text) {
        case 'test':
          return Promise.resolve(def.parentIdDefault === 10 ? 'add.test': 'wrong default');
        case 'parent':
          return Promise.resolve(def.parentText === 'parent' ? 'found.parent': 'wrong parent');
        case 'parentGuid':
          return Promise.resolve(def.parentGuid === 'parentGuid' ? 'found.parentGuid': 'wrong parent');
        case 'parentId':
          return Promise.resolve(def.parentId === 'parentId' ? 'found.parentId': 'wrong parent')

      }
      return Promise.resolve(def.parentIdDefault);
    }

  }


  describe('basic field', () => {
    let f = new FieldCode();
    logger.clear();
    it('empty', async () => {
      let r = await f.convert('code', {code: '', typeId: '', _source: 'master'}, logger);
      assert(_.isEmpty(r), 'should clear a empty record')
    });
    it('select field', async () => {
      let r = await f.convert('code', {code: 'test', codeId: '1234', _source: 'master'}, logger);
      assert(r.typeId === 1234,  'convert to number because it\'s a guid');
    });
    it('add a new code', async () => {
      let f2 = new FieldCode({ lookup: new LookupCode(), removeEmpty : false});
      let r = await f2.convert('code', {code: 'test'}, logger);
      assert.equal(r.typeId, 'add.test', 'did create code');
    });

    it('remove empty', async () => {
      let f2 = new FieldCode({ lookup: new LookupCode(), removeEmpty : false});
      let r = await f2.convert('code', {code: 'remove empty', _remove:true}, logger);
      assert.isDefined(r.typeId, 'still there');
      assert.isDefined(r._remove, 'has remove');
      assert.equal(r._remove, 1, 'is true');
    });
  });
  describe('code with parent', () => {
    it('add a new code parent', async () => {
      let f2 = new FieldCode({ lookup: new LookupCode()});
      let r = await f2.convert('code', {code: 'parent', parentText: 'parent'}, logger);
      assert.equal(r.typeId, 'found.parent', 'did create code');
    });
    it('add a new code parentGuid', async () => {
      let f2 = new FieldCode({ lookup: new LookupCode()});
      let r = await f2.convert('code', {code: 'parentGuid', parentGuid: 'parentGuid'}, logger);
      assert.equal(r.typeId, 'found.parentGuid', 'did create code');
    });
    it('add a new code parentId', async () => {
      let f2 = new FieldCode({ lookup: new LookupCode()});
      let r = await f2.convert('code', {code: 'parentId', parentId: 'parentId'}, logger);
      assert.equal(r.typeId, 'found.parentId', 'did create code');
    });
    it('add a new code no parent', async () => {
      let f2 = new FieldCode({ lookup: new LookupCode()});
      let r = await f2.convert('code', {code: 'parent.none'}, logger);
      assert.equal(r.typeId, 10, 'use the default');
    });
  });

  describe('key', () => {
    let f = new FieldCode();
    it('set', async () => {
      let r = await f.convert('code', {code: 'Testing with key', _parent:'test'}, logger);
      assert.isDefined(r._parent, 'has key');
      assert.equal(r._parent, 'test', 'got value')
    });
  });

  describe('in record', async () => {
    let rec = new Record({removeEmpty: false,  lookup: new LookupCode()  });
    it('list code', async () => {
      let r = await rec.convert('rec', { code: [{code: 'test in record'}]});
      assert.isDefined(r.code, 'should have codes');
      assert.equal(r.code.length, 1, 'one code');
      assert.isDefined(r.code[0].typeId, 'has id')
    })
  });

  describe('lookup access', async () => {
    let called = false;

    class TestLookup extends Lookup {
      async code(fieldName, value, defaults, data) {
        called = true;
        return super.code(fieldName, value, defaults, data);
      }
    }
    let rec = new Record({removeEmpty: false, lookup: new TestLookup()});
    it('is it called', async () => {
      assert.isFalse(called, 'should call the code func');
      let r = await rec.convert('rec', { code: [{code: 'testing'}]});
      assert.isTrue(called, 'should call the code func');
    });
  })

  describe('mode', async() => {
    let f = new FieldCode();
    it('set', async () => {
      let r = await f.convert('code', {code: 'Testing with key', _mode:'add'}, logger);
      assert.isDefined(r._mode);
      assert.equal(r._mode, 1)
    });
  });

  describe('empty code', async() => {
    let f = new FieldCode();
    it('should return empty object', async () => {
      let r = await f.convert('code', {_mode:'add'}, logger);
      assert.isUndefined(r._mode);
      assert.equal(Object.keys(r).length, 0)
    });
  })
})
