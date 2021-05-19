/**
 * Test the Fields
 */
const Chai = require('chai');
const assert = Chai.assert;
const _ = require('lodash');
const Logger = require('logger');
const Lookup = require('../lib/lookup');
const FieldComposed = require('../field/field-composed').FieldComposed;

describe('field.composed', () => {
  let logger = new Logger({toConsole: false});
  let f = new FieldComposed({ lookup: new Lookup()});

  describe('general', () => {

    logger.clear();
    it('empty', async () => {
      let r = await f.convert('composed', {}, logger);
      assert(_.isEmpty(r), 'empty');
      r = await f.convert('composed', {value: ''}, logger);
      assert(_.isEmpty(r), 'empty');
      r = await f.convert('composed', {value: undefined}, logger);
      assert(_.isEmpty(r), 'empty');
    });
    it('not valid field', async () => {
      try {
        let r = await f.convert('composed', {unknownField: 'test'}, logger);
        assert.fail('field not defined');
      } catch (e) {
        assert.isDefined(e.type, 'should hava an error');
        assert.equal(e.type, 'ErrorFieldNotAllowed');
        assert(e.fields.length === 1, 'one field');
        assert(e.fields[0] === 'unknownField', 'the name');
      }
    });
  });

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
      let field = new FieldComposed({
        lookupFunctionName: 'code',
        lookup: new LookupInsertOnly(),
        // must force otherwise the data is not parsed
        // 2021: emptyAllow: false,
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
      // assert.equal(r.typeId, 0)
      assert.isTrue(_.isEmpty(r))
    })
  })
  describe('parent', () => {
    it('set', async () => {
      let r = await f.convert('composed', {type: '', value: 'some value', _parent: 'theKey'}, logger);
      assert.isDefined(r._parent, 'has parent');
      assert.equal(r._parent, 'theKey', 'did set')
    });
  })
});
