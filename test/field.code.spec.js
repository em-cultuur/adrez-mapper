const Chai = require('chai');
const assert = Chai.assert;
const _ = require('lodash');
const Logger = require('logger');
const Lookup = require('../lib/lookup');
const FieldCode = require('../field/field-code').FieldCode;
const Record = require('../field/record').AdrezRecord;
describe('field.code', () => {

  let logger = new Logger({toConsole: false});

  // describe('basic field', () => {
  //   let f = new FieldCode();
  //   logger.clear();
  //   it('empty', async () => {
  //     let r = await f.convert('code', {code: '', codeId: '', _source: 'master'}, logger);
  //     assert(_.isEmpty(r), 'should clear a empty record')
  //   });
  //   it('select field', async () => {
  //     let r = await f.convert('code', {code: 'test', codeId: '1234', _source: 'master'}, logger);
  //     assert(r.codeId === '1234', 'select code Id');
  //   });
  //   it('leave empty', async () => {
  //     let f2 = new FieldCode({ lookup: new Lookup(), removeEmpty : false});
  //     let r = await f2.convert('code', {code: 'test'}, logger);
  //     assert.isDefined(r.codeId, 'still there');
  //   });
  //   it('remove empty', async () => {
  //     let f2 = new FieldCode({ lookup: new Lookup(), removeEmpty : false});
  //     let r = await f2.convert('code', {code: 'test', _remove:true}, logger);
  //     assert.isDefined(r.codeId, 'still there');
  //     assert.isDefined(r._remove, 'has remove');
  //     assert.equal(r._remove, 1, 'is true');
  //   });
  // })
  describe('in record', async () => {
    let rec = new Record({removeEmpty: false});
    it('list code', async () => {
      let r = await rec.convert('rec', { code: [{code: 'testing'}]});
      assert.isDefined(r.code, 'should have codes');
      assert.equal(r.code.length, 1, 'one code');
      assert.isDefined(r.code[0].codeId, 'has id')
    })
  })
})