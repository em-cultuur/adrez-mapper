/**
 *
 */
const Chai = require('chai');
const assert = Chai.assert;
const Logger = require('logger');
const Record = require('../field/record').AdrezRecord;

describe('record', () => {
  let logger = new Logger({toConsole: false});

  describe('convert', () => {
    let rec = new Record();
    it('empty', async () => {
      let r = await rec.convert('rec', {}, logger);
      assert(Object.keys(r).length === 0, 'nothing created')
    });
    it('unknown fields', async () => {
      let r;
      try {
        r = await rec.convert('rec', {test: '123'}, logger);
        assert(false, 'should throw error')
      } catch (e) {
        assert(e.type === 'ErrorFieldNotAllowed', 'got the error');
        assert(logger.hasErrors(), 'something is wrong');
        assert(logger.errors.length === 1, 'one error');
        assert(logger.errors[0].message === 'field does not exist', 'not found');
        assert(logger.errors[0].fieldName === 'rec.test', 'defined the field')
      }
    });
    it('convert fields', async () => {
      let r = await rec.convert('rec', {telephone: [{telephoneInt: '0123456789'}]}, logger);
      assert(r.telephone[0].value === '+31 (12) 3456789', 'did the convert')
    });
  });
  describe('lookup composed type', () => {
    logger.clear();
    let rec = new Record({
      email: {
        lookup: function(value, baseType, fields, data) {
          return 1234;
        }
      }
    });
    it('convert fields', async () => {
      let r = await rec.convert('rec', {email: [{email: 'info@test.com', type: 'work'}]}, logger);
      assert.equal(r.email[0].value,'info@test.com', 'did the convert');
      assert.isUndefined(r.email[0].type, 'removed type');
      assert.isDefined(r.email[0].typeId, 'changed to number');
      assert.equal(r.email[0].typeId, 1234, 'did read it');
    });
  });

  describe('lookup code.code', () => {
    logger.clear();
    let rec = new Record({
      lookup: function(value, baseType, fields, data) {
        if (baseType.substr(0,4) === 'tbl:') {
          return 33
        }
        return 1234;
      }
    });
    it('convert fields', async () => {
      let r = await rec.convert('rec', {code: [{code: 'newsletter', type: 'mailint'}]}, logger);
      assert.equal(r.code[0].codeId, 33, 'did the convert');
      assert.isUndefined(r.code[0].type, 'removed type');
      assert.isDefined(r.code[0].typeId, 'changed to number');
      assert.equal(r.code[0].typeId, 1234, 'did read it');
    });
  })
});