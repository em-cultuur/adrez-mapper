/**
 *
 */
const Chai = require('chai');
const assert = Chai.assert;
const Logger = require('logger');
const Record = require('../field/record').AdrezRecord;
const Lookup = require('../lib/lookup');

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
      r = await rec.convert('rec', {test: '123'}, logger);
      assert.isDefined(r.name, 'got result')
      assert.equal(r.type, 'ErrorFieldNotAllowed', 'got the error')
      assert(logger.hasErrors(), 'something is wrong');
      assert(logger.errors.length === 1, 'one error');
      assert(logger.errors[0].message === 'field does not exist', 'not found');
      assert(logger.errors[0].fieldName === 'rec.test', 'defined the field')
    });
    it('convert fields', async () => {
      let r = await rec.convert('rec', {telephone: [{telephoneInt: '0123456789'}]}, logger);
      assert(r.telephone[0].value === '+31 (12) 3456789', 'did the convert')
    });
  });
  describe('lookup composed type', () => {
    logger.clear();
    class ComposedLookup extends Lookup {
      async email(fieldName, value, defaults, data) {
        return 1234
        // return super.code(fieldName, value, defaults, data);
      }
    }

    let rec = new Record({
      email: {
        lookup: new ComposedLookup()
        // lookup: async function(value, baseType, fields, data) {
        //   return Promise.resolve(1234);
        // }
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
    class CodeLookup extends Lookup {
      async code(fieldName, value, defaults, data) {
        return 33;
      }
    }
    let rec = new Record({
      lookup: new CodeLookup()
      // lookup: async function(value, baseType, fields, data) {
      //   return 33
      // }
    });
    it('convert fields', async () => {
      let r = await rec.convert('rec', {code: [{code: 'newsletter'}]}, logger);
      assert.equal(r.code[0].codeId, 33, 'did the convert');
    });
  });
  describe('extra field', () => {
    logger.clear();
    class ExtraLookup extends Lookup {
      async extra(fieldName, value, defaults, data) {
        return 33
      }
    }
    let rec = new Record({
      lookup: new ExtraLookup()
    });
    it('convert fields', async () => {
      let r = await rec.convert('rec', {extra: [{type: 'has newsletter', boolean: '0'}]}, logger);
      assert.equal(r.extra[0].typeId, 33, 'did the convert');
      assert.equal(r.extra[0].text, "0", 'did the convert');
    });
  })


});