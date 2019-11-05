const Chai = require('chai');
const assert = Chai.assert;
const _ = require('lodash');
const Logger = require('logger');
const Lookup = require('../lib/lookup');
const FieldCampaignCode = require('../field/field-campaign-code').FieldCampaignCode;

describe('field.campaign-code', () => {
  let logger = new Logger({toConsole: false});

  class TypeLookup extends Lookup {
    async campaignCode(fieldName, value, defaults, data) {
      if (value === 'uitnodiging') {
        return '123'
      }
      return Promise.resolve(defaults);
    }
  }

  let f = new FieldCampaignCode({
    lookup: new TypeLookup()
  });

  describe('type/source',  () => {
    logger.clear();
    it('translate default', async () => {
      let r = await f.convert('campaigncode', {code: 'test', _parent: 'test'}, logger);
      assert.equal(r.typeId, 0, 'found default');
      assert.equal(r._parent, 'test', 'did store test')
    });
    it('translate value', async () => {
      let r = await f.convert('campaigncode', {code: 'uitnodiging'}, logger);
      assert.equal(r.typeId, '123', 'found default')
    });
  });

});
