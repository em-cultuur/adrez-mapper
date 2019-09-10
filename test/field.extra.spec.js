const Chai = require('chai');
const assert = Chai.assert;
const _ = require('lodash');
const Logger = require('logger');
const Lookup = require('../lib/lookup');
const FieldExtra = require('../field/field-extra').FieldExtra;
const Record = require('../field/record').AdrezRecord;

describe('field.extra', () => {

  let logger = new Logger({toConsole: false});
  describe('extra',  () => {
    let f = new FieldExtra({lookup: new Lookup()});
    logger.clear();
    it('empty', async () => {
      let r = await f.convert('extra', {text: '', _source: 'master'}, logger);
      assert.isEmpty(r, 'should clear a empty record')
    });
    it('text field', async () => {
      let r = await f.convert('extra', {text: 'info', type: 'master'}, logger);
      assert.equal(r.text, 'info', 'place in text');
      assert.isDefined(r.typeId, 'has type id');
      assert.equal(r._type, 'text', 'set the type')
    });
    it('description field', async () => {
      let r = await f.convert('extra', {description: 'info', type: 'master'}, logger);
      assert.equal(r.description, 'info', 'place in text');
      assert.isDefined(r.typeId, 'has type id');
    });
    it('boolean field', async () => {
      let r = await f.convert('extra', {boolean: '1', type: 'master'}, logger);
      assert.equal(r.text, '1', 'place in text');
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
  })
})