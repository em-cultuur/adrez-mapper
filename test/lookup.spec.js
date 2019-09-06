const Chai = require('chai');
const assert = Chai.assert;
const _ = require('lodash');
const Logger = require('logger');
const Lookup = require('../lib/lookup');

const FieldContact = require('../field/field-contact').FieldContact;

class ContactLookup extends Lookup {
  async execContact(fieldName, value, data) {
    // return super.execContact(value, data);
    const types = [{ name: 'instituut', value: 101}, { name: 'man', value: 102}, { name: 'vrouw', value: 103}];
    let id = _.find( types, (t) => {return t.name === value});
    if (id) {
      return id.value
    }
    return 105;
  }
}

describe('lookup', () => {
  describe('contact', () => {
    let lookup = new ContactLookup({ logger: new Logger({toConsole: false})});
    let f = new FieldContact({
      lookup: lookup
    });

    it('fullname', async () => {
      let r = await f.convert('contact', {fullName: 'Jan de Hond'}, lookup.logger);
      assert(r.firstName === 'Jan' && r.name === 'Hond' && r.namePrefix === 'de' && r.typeId === 105, 'got all');
    });
  })
});