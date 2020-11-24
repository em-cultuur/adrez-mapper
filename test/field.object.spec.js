/**
 * Test the Fields
 */
const Chai = require('chai');
const assert = Chai.assert;
const _ = require('lodash');
const Logger = require('logger');
const Lookup = require('../lib/lookup');
const FieldObject = require('../field/field-object').FieldObject;
const FieldContact = require('../field/field-contact').FieldContact;

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

  it('_mode values', async() => {
    let field = new FieldObject({
    });
    let r = await field.convert('object', {
      type: 'John',
      _mode: 'add'
    }, logger);
    assert.equal(r._mode, 1);
    r = await field.convert('object', {
      type: 'John',
      _mode: 'update'
    }, logger);
    assert.equal(r._mode, 2);
    r = await field.convert('object', {
      type: 'John',
      _mode: 'delete'
    }, logger);
    assert.equal(r._mode, 4);
    r = await field.convert('object', {
      type: 'John',
      _mode: 'skip'
    }, logger);
    assert.equal(r._mode, 8);
    r = await field.convert('object', {
      type: 'John',
      _mode: 'inherit'
    }, logger);
    assert.equal(r._mode, 16);
    r = await field.convert('object', {
      type: 'John',
      _mode: ['add','update', 'delete','skip','inherit']
    }, logger);
    assert.equal(r._mode, 1+2+4+8+16);
    r = await field.convert('object', {
      type: 'John',
      _mode: 'add,inherit'
    }, logger);
    assert.equal(r._mode, 1+16);
    r = await field.convert('object', {
      type: 'John',
      _mode: 'add, inherit'
    }, logger);
    assert.equal(r._mode, 1+16);

    field = new FieldContact();
    r = await field.convert('object', {
      name: 'John',
      _mode: 'add, inherit'
    }, logger);
    assert.equal(r._mode, 1+16);
    field = new FieldContact();
    r = await field.convert('object', {
      organisation: 'JohnX',
      _mode: 'add, inherit'
    }, logger);
    assert.equal(r._mode, 1+16);
    r = await field.convert('object', {
      organisation: 'JohnX',
      _mode: 'delete,kill'
    }, logger);
    assert.equal(r._mode, 4+32);
  });

  it('empty _mode', async() => {
    let field = new FieldObject({});
    let r = await field.convert('object', {
      type: '',
      _mode: 'add'
    }, logger);
    assert.isEmpty(r);
  });


});
