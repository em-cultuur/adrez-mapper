/**
 * Test Location Fields
 */
const Chai = require('chai');
const assert = Chai.assert;
const _ = require('lodash');
const Logger = require('logger');
const Lookup = require('../lib/lookup');
const Countries = require('../field/field-text-zipcode').Countries;
const FieldLocatorContact = require('../field/field-locator-contact').FieldLocatorContact;
const FieldContact = require('../field/field-contact').FieldContact;
const Record = require('../field/record').AdrezRecord;


describe('field.locator.contact', () => {
  let logger = new Logger({toConsole: false});
  let f;
  before( () => {
    f = new FieldLocatorContact({ logger: logger});
  });

  class ContactLookup extends Lookup {

  }


  it('create locator', async () => {
    let r = await f.convert('locatorContact',   { name: 'John', subName: 'the', fullName: 'the John', type: 'text', typeId: 1, id: 123, guid:'GUID'});
    assert.equal(r.name, 'John');
    assert.equal(r.subName, 'the');
    assert.equal(r.fullName, 'the John');
    assert.equal(r.typeId, 1);
    assert.isUndefined(r.type, 'removed because typeId exists');
    assert.equal(r.id, 123);
    assert.equal(r.guid, 'GUID');
  });

  it('empty locator', async () => {
    let r = await f.convert('locatorContact',   { });
    assert.equal(Object.keys(r).length, 0)
  });

  it('contact lookup', async () => {
    let field = new FieldContact({lookup: new ContactLookup()});
    let r = await field.convert('contact',   { name: 'John', locator: {name : 'John', subName: 'the'}});
    assert.isDefined(r.locator);
    assert.equal(r.locator.name, 'John');
  })

  it('contact - empty lookup', async () => {
    let field = new FieldContact({lookup: new ContactLookup()});
    let r = await field.convert('contact',   { name: 'John', locator: {name : ''}});
    assert.isDefined(r.locator.name);
  });

  it('record', async () => {
    let record = new Record();
    let r = await record.convert('rec', { contact:[{name: 'John', locator: {name: 'John'}}]})
    assert.equal(r.contact.length, 1)
    assert.isDefined(r.contact[0].locator)
    assert.equal(r.contact[0].locator.name, 'John');
  })

  it ('record - empty locator', async() => {
    let record = new Record();
    let r = await record.convert('rec', { contact:[{name: 'John', locator: {name: '', fullName: undefined}}]})
    assert.equal(r.contact.length, 1)
    assert.isDefined(r.contact[0].locator)
    assert.equal(r.contact[0].locator.name, '');
    assert.equal(r.contact[0].locator.fullName);
  })



});
