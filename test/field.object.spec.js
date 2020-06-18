/**
 * Test the Fields
 */
const Chai = require('chai');
const assert = Chai.assert;
const _ = require('lodash');
const Logger = require('logger');
const Lookup = require('../lib/lookup');
const FieldObject = require('../field/field-object').FieldObject;

describe('field.object', () => {
  let logger = new Logger({toConsole: false});
  class LookupObject extends Lookup {
    async code(fieldName, def) {
      if (def.textNoFind && def.text === undefined) {
        return 456
      }
      if (def.guid === 'TST_CODE') {
        return 123;
      }
      return Promise.resolve(def.parentIdDefault);
    }
  }

  let f = new FieldObject({
    lookupFunctionName: 'code',
    lookup: new LookupObject(),
    // must force otherwise the data is not parsed
    emptyAllow: false,
  });

  describe('general', () => {
    logger.clear();
    it('type lookup', async () => {
      let r = await f.convert('object', {
        type: 'John',
        typeGuid: 'TST_CODE'
      }, logger);
      assert.equal(r.typeId, 123, 'translate the type');
    });
    it('type lookup, no find', async() => {
      let r = await f.convert('object', {
        type_: 'John',
        typeGuid: 'TST_CODE'
      }, logger);
      assert.equal(r.typeId, 456, 'translate the type');
    });
    it('type lookup, no find', async() => {
      let r = await f.convert('object', {
        type_: 'John',
        type: 'Jack',               // type is overloaded in removed because type_ does exist
        typeGuid: 'TST_CODE'
      }, logger);
      assert.equal(r.typeId, 456, 'translate the type');
    })

  });

  describe('typeIsInsertOnly', () => {
    logger.clear();
    it('type lookup', async () => {
      let r = await f.convert('object', {
        type: 'John',
        typeInsertOnly: 1
      }, logger);
      assert.equal(r.typeInsertOnly, true, 'translate the type');
    })

  })
});
