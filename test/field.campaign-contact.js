const Chai = require('chai');
const assert = Chai.assert;
const _ = require('lodash');
const Logger = require('logger');
const Lookup = require('../lib/lookup');
const FieldCampaignContact = require('../field/field-campaign-contact').FieldCampaignContact;

describe('field.campaign-contact', () => {
  let logger = new Logger({toConsole: false});

  class TypeLookup extends Lookup {
    async campaignContact(fieldName, value, defaults, data) {
      if (value === 'aangemeld') {
        return '123'
      }
      return Promise.resolve(defaults);
    }
  }

  let f = new FieldCampaignContact({
    lookup: new TypeLookup()
  });

  describe('type/source',  () => {
    logger.clear();
    it('translate default', async () => {
      let r = await f.convert('campaigncontact', {code: 'test'}, logger);
      assert.equal(r.typeId, 0, 'found default');
    });
    it('translate value', async () => {
      let r = await f.convert('campaigncontact', {_campaign: 'test', code: 'aangemeld'}, logger);
      assert.equal(r.typeId, '123', 'found default')
    });
    it('store value', async () => {
      let r = await f.convert('campaigncontact', {_campaign: 'test', code: 'aangemeld', text: '2'}, logger);
      assert.equal(r.typeId, '123', 'found default');
      assert.equal(r.text, '2', 'store value')
    });

    it('empty value', async () => {
      let r = await f.convert('campaigncontact', {_campaign: 'test', _contact: 'jan', code: undefined}, logger);
      assert.isUndefined(r.typeId, 'no type');
    });

  });

});
