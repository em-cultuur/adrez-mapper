const Chai = require('chai');
const assert = Chai.assert;
const _ = require('lodash');
const Logger = require('logger');
const FieldExtra = require('../field/field-extra').FieldExtra;
const CODE_TYPE_EXTRA = require('../field/field-extra').FIELD_GROUP_TYPE_EXTRA;
const Record = require('../field/record').AdrezRecord;

describe('field.extra', () => {

  class LookupExtra {
    async extra(fieldName, def) {
      if (def.text === 'master' && def.parentGuid === undefined) {
        return Promise.resolve('master.string')
      } else if (def.text === 'type.text') {
        return Promise.resolve(def.fieldTypeGuid === 'ADREZ_FIELD_STRING' ? 'on guid' : 'wrong')
      }
      return Promise.resolve(def.parentIdDefault);
    }
  }

  let logger = new Logger({toConsole: false});
  describe('extra',  () => {
    let f = new FieldExtra({lookup: new LookupExtra()});
    logger.clear();
    it('empty', async () => {
      let r = await f.convert('extra', {text: '', _source: 'master'}, logger);
      assert.isEmpty(r, 'should clear a empty record')
    });
    it('text field', async () => {
      let r = await f.convert('extra', {text: 'text field'}, logger);
      assert.equal(r.text, 'text field', 'place in text');
      assert.isDefined(r.typeId, 'has type id');
      assert.equal(r.typeId, 201, 'set the type to the codeId of none')
    });
    it('description field', async () => {
      let r = await f.convert('extra', {description: 'description field', type: 'master'}, logger);
      assert.equal(r.description, 'description field', 'place in text');
      assert.equal(r.typeId, 'master.string', 'has type id');
    });
    it('boolean field', async () => {
      let r = await f.convert('extra', {boolean: '1', type: 'master'}, logger);
      assert.equal(r.text, '1', 'place in text');
      assert.isDefined(r.typeId, 'has type id');
    });
    it('number field', async () => {
      let r = await f.convert('extra', {number: 123, type: 'master'}, logger);
      assert.equal(r.text, 123, 'place in text');
      assert.isDefined(r.typeId, 'has type id');
    });

  });


  describe('in record', async () => {
    let rec = new Record({removeEmpty: false});
    it('extra', async () => {
      let r = await rec.convert('rec', { extra: [{text: 'testing', type: "work"}, {description:'some more text', type:'when'} ]});
      assert.isDefined(r.extra, 'should have fields');
      assert.equal(r.extra.length, 2, 'two fields');
      assert.isDefined(r.extra[0].typeId, 'has id')
    })
  });

  describe('record', async() => {
    let rec = new Record({removeEmpty: false, lookup : new LookupExtra()});
    it('extra (text/memo)', async () => {
      let r = await rec.convert('rec', {
        extra: [
          {text: 'testing', type: "type.text"},
          {description: 'some more text', type: 'type.memo'}
        ]
      });
      assert.isDefined(r.extra, 'should have fields');
      assert.isTrue(Array.isArray(r.extra), 'returned array');
      assert.equal(r.extra.length, 2, 'two elements');
      assert.equal(r.extra[0].typeId, 'on guid', 'found the base type');
    });

  })
})
