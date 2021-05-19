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

  describe('storeGroups', () => {
    let f = new FieldObject({
      lookupFunctionName: 'code',
      lookup: new LookupObject(),
      // must force otherwise the data is not parsed
      emptyAllow: false,
    });

    it('wrong field name', () => {
      try {
        f.addStoreGroup('test', ['typeId', 'wrong'])
        assert.fail('the field wrong does not exist')
      } catch (e) {
        assert.equal(e.message, 'field wrong is undefined')
      }
    });

    it ('check one field, one rule', async() => {
      f.addStoreGroup('type', ['typeId'])
      assert.isTrue(f.mustStoredRecord({isDefault: true, typeId: 1}))
      assert.isFalse(f.mustStoredRecord({isDefault: true}))
      assert.isTrue(f.mustStoredRecord({typeId: 0}))
      assert.isFalse(f.mustStoredRecord({typeId: undefined}))
    });

    it('check multi rule', async() => {
      f.addStoreGroup('parent', ['_parent'])
      assert.isFalse(f.mustStoredRecord({isDefault: true}))
      assert.isTrue(f.mustStoredRecord({isDefault: true, _parent: 'main'}))
    })
  })


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



  it('_mode values', async() => {
    let field = new FieldObject({
      needMode: false
    });
    let r = await field.convert('object', {
      type: 'John',
      _mode: 'add',
      typeInsertOnly: 1 // otherwise the data is not stored
    }, logger);
    assert.equal(r._mode, 1);
    r = await field.convert('object', {
      type: 'John',
      _mode: 'update',
      typeInsertOnly: 1
    }, logger);
    assert.equal(r._mode, 2);
    r = await field.convert('object', {
      type: 'John',
      _mode: 'delete',
      typeInsertOnly: 1
    }, logger);
    assert.equal(r._mode, 4);
    r = await field.convert('object', {
      type: 'John',
      _mode: 'skip',
      typeInsertOnly: 1
    }, logger);
    assert.equal(r._mode, 8);
    r = await field.convert('object', {
      type: 'John',
      _mode: 'inherit',
      typeInsertOnly: 1
    }, logger);
    assert.equal(r._mode, 16);
    r = await field.convert('object', {
      type: 'John',
      _mode: ['add','update', 'delete','skip','inherit'],
      typeInsertOnly: 1
    }, logger);
    assert.equal(r._mode, 1+2+4+8+16);
    r = await field.convert('object', {
      fieldTypeId: 12
    }, logger);
    assert.isUndefined(r.fieldTypeId)
    r = await field.convert('object', {
      fieldTypeId: 12,
      typeInsertOnly: 1,
      _mode: ['force']
    }, logger);
    assert.equal(r.fieldTypeId, 12)

    r = await field.convert('object', {
      type: 'John',
      typeInsertOnly: 1,
      _mode: 'add,inherit'
    }, logger);
    assert.equal(r._mode, 1+16);
    r = await field.convert('object', {
      type: 'John',
      typeInsertOnly: 1,
      _mode: 'add, inherit'
    }, logger);
    assert.equal(r._mode, 1+16);

    field = new FieldContact();
    r = await field.convert('object', {
      name: 'John',
      typeInsertOnly: 1,
      _mode: 'add, inherit'
    }, logger);
    assert.equal(r._mode, 1+16);
    field = new FieldContact();
    r = await field.convert('object', {
      name: 'JohnX',
      typeInsertOnly: 1,
      _mode: 'add, inherit'
    }, logger);
    assert.equal(r._mode, 1+16);
    r = await field.convert('object', {
      name: 'JohnX',
      typeInsertOnly: 1,
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
