const Chai = require('chai');
const assert = Chai.assert;
const _ = require('lodash');
const Logger = require('logger');
const Lookup = require('../lib/lookup');
const FieldCampaign = require('../field/field-campaign').FieldCampaign;
const DEFAULT_CAMPAIGN_TYPE = require('../field/field-campaign').DEFAULT_CAMPAIGN_TYPE;
const DEFAULT_CAMPAIGN_GROUP = require('../field/field-campaign').DEFAULT_CAMPAIGN_GROUP;
describe('field.campaign', () => {
  let logger = new Logger({toConsole: false});

  class TypeLookup extends Lookup {
    async campaign(fieldName, value, defaults, data) {
      if (value.type === 'x') {
        return 123
      }
      return super.contact(fieldName, value, defaults, data);
    }
    async campaignGroup(fieldName, value, defaults, data) {
      if (value.group === 'xx') {
        return 123
      }
      return super.contact(fieldName, value, defaults, data);
    }
  }

  let f = new FieldCampaign({
    lookup: new TypeLookup()
  });

  describe('type/source',  () => {
    logger.clear();
    it('translate default', async () => {
      let r = await f.convert('campaign', {title: 'zeeland'}, logger);
      assert.equal(r.typeId, DEFAULT_CAMPAIGN_TYPE, 'found default')
    });
    it('translate value', async () => {
      let r = await f.convert('campaign', {title: 'zeeland', type: 'x'}, logger);
      assert.equal(r.typeId, 123, 'found type');
      assert.isUndefined(r.type, 'did remove');
    });
  });

  describe('group',  () => {
    logger.clear();
    it('translate default', async () => {
      let r = await f.convert('campaign', {title: 'zeeland'}, logger);
      assert.equal(r.groupId, DEFAULT_CAMPAIGN_GROUP, 'found default')
    });
    it('translate value', async () => {
      let r = await f.convert('campaign', {title: 'zeeland', group: 'xx'}, logger);
      assert.equal(r.groupId, 123, 'found group')
    });
  });

});
