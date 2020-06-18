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
  //
  // describe('general', () => {
  //   logger.clear();
  //   it('type lookup', async () => {
  //     let r = await f.convert('object', {
  //       type: 'John',
  //       typeGuid: 'TST_CODE'
  //     }, logger);
  //     assert.equal(r.typeId, 123, 'translate the type');
  //   });
  //   it('type lookup, no find', async() => {
  //     let r = await f.convert('object', {
  //       type_: 'John',
  //       typeGuid: 'TST_CODE'
  //     }, logger);
  //     assert.equal(r.typeId, 456, 'translate the type');
  //   });
  //   it('type lookup, no find', async() => {
  //     let r = await f.convert('object', {
  //       type_: 'John',
  //       type: 'Jack',               // type is overloaded in removed because type_ does exist
  //       typeGuid: 'TST_CODE'
  //     }, logger);
  //     assert.equal(r.typeId, 456, 'translate the type');
  //   })
  //
  // });

  describe('typeIsInsertOnly', () => {
    class LookupInsertOnly extends Lookup {
      async code(fieldName, def) {
        let result;
        if (!def.hasOwnProperty('fieldTypeInsertOnly')) {
          result = -1 // it should ALWAYS have this property
        } else if (def.fieldTypeInsertOnly) {
          result = 1
        } else {
          result = 0;
        }
        return Promise.resolve(result);
      }
    }

    // it('type lookup', async () => {
    //   logger.clear();
    //   let r = await f.convert('object', {
    //     type: 'John',
    //     typeInsertOnly: 1
    //   }, logger);
    //   assert.equal(r.typeInsertOnly, true, 'translate the type');
    // });

    it('lookup with the value', async() => {
      logger.clear();
      let field = new FieldObject({
        lookupFunctionName: 'code',
        lookup: new LookupInsertOnly(),
        // must force otherwise the data is not parsed
        emptyAllow: false,
      });
      let r = await field.convert('object', {
        type: 'John',
        typeInsertOnly: 1,
        typeGuid: 'NoRealy'
      }, logger);
      assert.equal(r.typeId, 1)
      r = await field.convert('object', {
        type: 'John',
        typeInsertOnly: 0,
        typeGuid: 'NoRealy'
      }, logger);
      assert.equal(r.typeId, 0);
      r = await field.convert('object', {
        type: 'John',
        typeGuid: 'NoRealy'
      }, logger);
      assert.equal(r.typeId, 0)
    })

  })
});
