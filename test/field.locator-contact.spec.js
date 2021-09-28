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

  it('trueName', async() => {
    let r = await f.convert('locatorContact',   { trueName: 'Erick de Boer'});
    assert.equal(r.fullName, 'Boer, Erick de');
    r = await f.convert('locatorContact',   { trueName: 'Jan Willem de Groot'});
    assert.equal(r.fullName, 'Groot, Jan Willem de');
  })

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
    assert.isUndefined(r.locator);
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
    assert.isUndefined(r.contact[0].locator)
  })


  it('record - locator - email', async() => {
    let record = new Record();
    let r = await record.convert('rec', { contact:[{name: 'John', locator: {email: 'info@test.com', fullName: undefined}}]})
    assert.equal(r.contact.length, 1)
    assert.isDefined(r.contact[0].locator)
    assert.equal(r.contact[0].locator.email, 'info@test.com');
    assert.equal(r.contact[0].locator.fullName);
  })

  it('record - locator - allowMulti', async() => {
    let record = new Record();
    let r = await record.convert('rec', { contact:[{name: 'John', locator: {email: 'info@test.com', _allowMulti: true}}]})
    assert.equal(r.contact.length, 1)
    assert.isDefined(r.contact[0].locator)
    assert.equal(r.contact[0].locator.email, 'info@test.com');
    assert.equal(r.contact[0].locator._allowMulti, 1);
  })

  it('record - empty locator with _allowMulti', async ()=> {
    let record = new Record();
    let r = await record.convert('rec', { contact:[{name: 'John', locator: {email: '', _allowMulti: true}}]})
    assert.equal(r.contact.length, 1)
    assert.isUndefined(r.contact[0].locator);

    r = await record.convert('rec', { contact:[{name: '', locator: {name: '', _allowMulti: true}}]})
    assert.isUndefined(r.contact);
  })

  it('record - locator without fields but with _allowMulti', async ()=> {
    let record = new Record();
    let r = await record.convert('rec', { contact:[{name: 'John', locator: {_allowMulti: true}}]})
    assert.equal(r.contact.length, 1)
    assert.isUndefined(r.contact[0].locator);

    r = await record.convert('rec', { contact:[{name: '', locator: { _allowMulti: true}}]})
    assert.isUndefined(r.contact);
  })
});
