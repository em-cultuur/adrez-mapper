const Chai = require('chai');
const assert = Chai.assert;
const _ = require('lodash');
const Logger = require('logger');
const Lookup = require('../lib/lookup');
const FieldEmail = require('../field/field-email').FieldEmail;

describe('field.email', () => {

  let logger = new Logger({toConsole: false});
  describe('email',  () => {
    let f = new FieldEmail({lookup: new Lookup()});
    logger.clear();
    it('empty', async () => {
      let r = await f.convert('email', {email: '', _source: 'master'}, logger);
      assert.isEmpty(r, 'should clear a empty record')
    });
    it('select field', async () => {
      let r = await f.convert('email', {email: 'INFO@test.com', _source: 'master'}, logger);
      assert(r.value === 'info@test.com', 'select email en convert');
      r = await f.convert('email', {email: 'INFO@test.com', value: 'test@test.com', _source: 'master'}, logger);
      assert(r.value === 'test@test.com', 'select value not email');
    });
  });

  it('leave empty', async () => {
    let f2 = new FieldEmail({ lookup: new Lookup(), removeEmpty : false});
    let r = await f2.convert('email', {email: ''}, logger);
    assert.isDefined(r.value, 'still there');
    assert.equal(r.value, '', 'and empty')
  });

  it('force type', async () => {
    let f2 = new FieldEmail();
    let r = await f2.convert('email', {email: 'info@emcultuur.nl'}, logger);
    assert.equal(r.value, 'info@emcultuur.nl', 'value');
    assert.equal(r.typeId, 115, 'did set the typeId')
  })

});
