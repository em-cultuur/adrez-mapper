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

  describe('parent', () => {
    it('set', async () => {
      let r = await f.convert('composed', {type: '', value: 'some value', _parent: 'theKey'}, logger);
      assert.isDefined(r._parent, 'has parent');
      assert.equal(r._parent, 'theKey', 'did set')
    });
  })
});
