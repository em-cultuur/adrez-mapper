const Chai = require('chai');
const assert = Chai.assert;
const _ = require('lodash');
const Logger = require('logger');
const Lookup = require('../lib/lookup');
const FieldEmail = require('../field/field-email').FieldEmail;

describe('field.email', () => {

  let logger = new Logger({toConsole: false});

  LookupEmail = class {
    email(fieldName, def) {
      if (def.text === 'Nieuwsbrief') {
        return Promise.resolve('444')
      } else if (def.text === 'Privé') {
        return Promise.resolve('555')
      } else if (def.text === 'Custom') {
        return Promise.resolve('666');
      }
      return Promise.resolve(def.parentIdDefault);
    }
  }

  describe('email empty',  () => {
    let f = new FieldEmail({lookup: new Lookup()});
    logger.clear();
    it('empty', async () => {
      let r = await f.convert('email', {email: ''}, logger);
      assert.isEmpty(r, 'should clear a empty record')
    });
  });
  describe('type email', () => {
    let f = new FieldEmail({lookup: new Lookup()});
    it('select field', async () => {
      let r = await f.convert('email', {email: 'INFO@test.com'}, logger);
      assert(r.value === 'info@test.com', 'select email en convert');
      assert.equal(r.typeId, 115, 'made it an email');
      r = await f.convert('email', {email: 'INFO@test.com', value: 'test@test.com'}, logger);
      assert(r.value === 'test@test.com', 'select value not email');
    });
  });

  describe('setting types', () => {
    logger.clear();
    it('default is email', async () => {
      let f2 = new FieldEmail();
      let r = await f2.convert('email', {email: 'info@emcultuur.nl'}, logger);
      assert.equal(r.value, 'info@emcultuur.nl', 'value');
      assert.equal(r.typeId, 115, 'did set the typeId')
    });
    it('newsletter', async () => {
      let f2 = new FieldEmail({ lookup: new LookupEmail() });
      let r = await f2.convert('email', {newsletter: 'info@emcultuur.nl'}, logger);
      assert.equal(r.value, 'info@emcultuur.nl', 'value');
      assert.equal(r.typeId, 444, 'did set the typeId')
    });
    it('prive', async () => {
      let f2 = new FieldEmail({ lookup: new LookupEmail() });
      let r = await f2.convert('email', {prive: 'info@emcultuur.nl'}, logger);
      assert.equal(r.value, 'info@emcultuur.nl', 'value');
      assert.equal(r.typeId, 555, 'did set the typeId')
    });
    it('custom', async () => {
      let f2 = new FieldEmail({ lookup: new LookupEmail() });
      let r = await f2.convert('email', {email: 'info@emcultuur.nl', type: 'Custom'}, logger);
      assert.equal(r.value, 'info@emcultuur.nl', 'value');
      assert.equal(r.typeId, 666, 'did set the typeId')
    });

  })


});
