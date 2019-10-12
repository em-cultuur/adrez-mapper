/**
 * Test the Fields
 */
const Chai = require('chai');
const assert = Chai.assert;
const _ = require('lodash');
const Logger = require('logger');
const Lookup = require('../lib/lookup');
const FieldContact = require('../field/field-contact').FieldContact;

const DEFAULT_FUNCTION = require('../field/field-contact').DEFAULT_FUNCTION;
const DEFAULT_SALUTATION = require('../field/field-contact').DEFAULT_SALUTATION;
const DEFAULT_ORGANISATION = require('../field/field-contact').DEFAULT_ORGANISATION;

describe('field.contact', () => {
  let logger = new Logger({toConsole: false});

  class ContactLookup extends Lookup {
    async contact(fieldName, value, defaults, data) {
      const types = [{name: 'instituut', value: 101}, {name: 'man', value: 102}, {name: 'vrouw', value: 103}];
      let id = _.find(types, (t) => {
        return t.name === value
      });
      if (id) {
        return id.value
      }
      return super.contact(fieldName, value, defaults, data);
    }

    async gender(fieldName, value, defaults, data) {
      if (value.title === 'mevrouw') {
        delete data.title;
        return 103
      }
      if (value.type === 'man') {
        return 102
      }
      return super.gender(fieldName, value, defaults, data);
    }

    async contactFunction(fieldname, value, defaults, data) {
      if (value.function === 'jobber') {
        return Promise.resolve(444)
      }
      return Promise.resolve(defaults)
    }
    async contactSalutation(fieldname, value, defaults, data) {
      if (value.salutation === 'hi') {
        return Promise.resolve(444)
      }
      return Promise.resolve(defaults);
    }
  }
  let f = new FieldContact({
    lookup: new ContactLookup()
  });

  describe('fullname',  () => {
    logger.clear();
    it('fullname', async () => {
      let r = await f.convert('contact', {fullName: 'Jan de Hond'}, logger);
      assert(r.firstName === 'Jan' && r.name === 'Hond' && r.namePrefix === 'de', 'got all');
      assert.equal(r.fullName, 'Hond, Jan de', 'did fix' );
      r = await f.convert('contact', {fullName: 'dr. J. de Hond'}, logger);
      assert.equal(r.fullName, 'Hond, J. de', 'did it');
      assert(r.title === 'dr.' && r.firstName === undefined && r.firstLetters === 'J.' && r.name === 'Hond' && r.namePrefix === 'de', 'got all');
      r = await f.convert('contact', {fullName: 'Jan Willem de Boer'}, logger);
      assert(r.firstLetters = 'J.W.' && r.firstName === 'Jan' && r.middleName === 'Willem' && r.name === 'Boer' && r.namePrefix === 'de', 'got all');
      assert.equal(r.fullName, 'Boer, Jan Willem de', 'did generate');
      r = await f.convert('contact', {fullName: 'Jack (mojo) Man'}, logger);
      assert(r.firstName === 'Jack' && r.name === 'Man' && r.firstLetters === 'J.' && r.nickName === 'mojo', 'got all');
      r = await f.convert('contact', {fullName: 'Jan Willem Overmars'}, logger);
      assert.equal(r.fullName, 'Overmars, Jan Willem', 'did')
      assert(r.firstName === 'Jan' && r.middleName === 'Willem' && r.firstLetters === 'J.W.' && r.name === 'Overmars', 'got all');

      r = await f.convert('contact', {fullName: 'sergeant majoor Bert de Vries'}, logger);
      assert(r.firstName === 'Bert' && r.name === 'Vries' && r.firstLetters === 'B.' && r.title === 'sergeant majoor', 'got all');
      r = await f.convert('contact', {fullName: 'Abt Jan'}, logger);
      assert(r.name === 'Jan' && r.title === 'Abt', 'got all');
      assert.equal(r.fullName, 'Jan', 'did')
      r = await f.convert('contact', {fullName: 'Familie E. de Boer-Brenninkmeijer'}, logger);
      assert(r.name === 'Boer-Brenninkmeijer' && r.firstLetters === 'E.' && r.namePrefix === 'de', 'got all');
      r = await f.convert('contact', {fullName: 'Vera de Boer-van Woerdens'}, logger);
      assert(r.name === 'Woerdens' && r.firstLetters === 'V.B.' && r.middleName === 'Boer-van', 'got all');
      r = await f.convert('contact', {fullName: 'Jaap-Wieger van der Kreeft'}, logger);
      assert(r.name === 'Kreeft' && r.firstLetters === 'J.' && r.namePrefix === 'van der' && r.firstName === 'Jaap-Wieger', 'got all');
      r = await f.convert('contact', {fullName: 'Jaap Wieger van der Kreeft'}, logger);
      assert(r.name === 'Kreeft' && r.firstLetters === 'J.W.' && r.namePrefix === 'van der' && r.firstName === 'Jaap' && r.middleName === 'Wieger', 'got all')
    });
    it('specials', async () => {
      r = await f.convert('contact', {"fullName" :  "Test Customer"}, logger);
      assert.equal(r.fullName, 'Customer, Test', 'did change')
    })
  });
  describe('type and lookup',  () => {
    logger.clear();

    it('type', async () => {
      let r = await f.convert('contact', {fullName: 'Jan de Hond', typeId: 101}, logger);
      assert.equal(r.typeId, 101, 'leave it');
      r = await f.convert('contact', {fullName: 'Jan de Hond', type: 'man'}, logger);
      assert.equal(r.typeId, 102, 'changed');
      r = await f.convert('contact', {fullName: 'Jan de Hond'}, logger);
      assert.equal(r.typeId, 105, 'add it if unknown');
      r = await f.convert('contact', {fullName: 'Test Customer'}, logger);
      assert.equal(r.typeId, 105, 'got type');
      assert.equal(r.firstName, 'Test', 'name');
      assert.equal(r.firstLetters, 'T.', 'letter');
      assert.equal(r.name, 'Customer', 'name');
    });
    it('gender', async () => {
      let r = await f.convert('contact', {fullName: 'mevrouw Clara de Hond', typeId: 105}, logger);
      assert.equal(r.typeId, 103, 'did genderize on title');
      r = await f.convert('contact', {fullName: 'dr Clara de Hond', typeId: 102}, logger);
      assert.equal(r.typeId, 102, 'did genderize, result default')
    })
  });
  describe('function',  () => {
    it('has functionId', async() => {
      let r = await f.convert('contact', {fullName: 'Jan de Hond', functionId: 123}, logger);
      assert.isDefined(r.functionId, 'got functionId');
      assert.equal(r.functionId, 123, 'and set')
    });
    it('translate from text', async () => {
      let r = await f.convert('contact', {fullName: 'Jan de Hond', function: 'jobber'}, logger);
      assert.isDefined(r.functionId, 'got functionId');
      assert.equal(r.functionId, 444, 'and set');
      assert.equal(r.function, undefined, 'did remove the function')
    });
    it('set default', async () => {
      let r = await f.convert('contact', {fullName: 'Jan de Hond'}, logger);
      assert.isDefined(r.functionId, 'got functionId');
      assert.equal(r.functionId, DEFAULT_FUNCTION, 'and set');

    });
  });
  describe('salutation',  () => {
    it('has salutationId', async() => {
      let r = await f.convert('contact', {fullName: 'Jan de Hond', salutationId: 123}, logger);
      assert.isDefined(r.salutationId, 'got salutationId');
      assert.equal(r.salutationId, 123, 'and set')
    });
    it('translate from text', async () => {
      let r = await f.convert('contact', {fullName: 'Jan de Hond', salutation: 'hi'}, logger);
      assert.isDefined(r.salutationId, 'got salutationId');
      assert.equal(r.salutationId, 444, 'and set');
      assert.equal(r.salutation, undefined, 'did remove the text')
    });
    it('set default', async () => {
      let r = await f.convert('contact', {fullName: 'Jan de Hond'}, logger);
      assert.isDefined(r.salutationId, 'got Id');
      assert.equal(r.salutationId, DEFAULT_SALUTATION, 'and set');

    });
  });
  describe('organisation', () => {
    it('is org 1', async() => {
      let r = await f.convert('contact', {organisation: 'Working it', isOrganisation: true, functionId: '12'}, logger);
      assert.isDefined(r.typeId, 'got typeId');
      assert.equal(r.typeId, DEFAULT_ORGANISATION, 'and set');
      assert.equal(r.functionId, undefined, 'removed unwanted')
    });
    it('is org 2', async() => {
      let r = await f.convert('contact', {organisation: 'Working it'}, logger);
      assert.isDefined(r.typeId, 'got typeId');
      assert.equal(r.typeId, DEFAULT_ORGANISATION, 'and set')
    });
    it('is org 3', async() => {
      let r = await f.convert('contact', {name: 'Working it', isOrganisation: true, functionId: '12'}, logger);
      assert.isDefined(r.typeId, 'got typeId');
      assert.equal(r.typeId, DEFAULT_ORGANISATION, 'and set');
      assert.equal(r.functionId, undefined, 'removed unwanted');
      assert.equal(r.fullName, 'Working it', 'got full name');
      assert.equal(r.name, 'Working it', 'got name');
    });
  });
  describe('key/parent', () => {
    it('store the key', async () => {
      let r = await f.convert('contact', {name: 'Working it', _key: 'theKey'}, logger);
      assert.isDefined(r._key, 'got key');
      assert.equal(r._key, 'theKey', 'and set');
    });
    it('store the parent', async () => {
      let r = await f.convert('contact', {name: 'Working it', _parent: 'theKey'}, logger);
      assert.isDefined(r._parent, 'got key');
      assert.equal(r._parent, 'theKey', 'and set');
    })
  });

  describe('locator', () =>  {
    it('parse', async () => {
      let r = await f.convert('contact', {name: 'Working it', locator: { fullName: 'test' }}, logger);
      assert.isDefined(r.locator, 'has locator');
      assert.isDefined(r.locator.fullName, 'look for');
    })
  })
})

