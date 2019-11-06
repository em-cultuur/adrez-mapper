const Chai = require('chai');
const assert = Chai.assert;
const _ = require('lodash');
const Logger = require('logger');
const Lookup = require('../lib/lookup');
const FieldCampaign = require('../field/field-campaign').FieldCampaign;
const DEFAULT_CAMPAIGN_TYPE = require('../field/field-campaign').DEFAULT_CAMPAIGN_TYPE;
const DEFAULT_CAMPAIGN_GROUP = require('../field/field-campaign').DEFAULT_CAMPAIGN_GROUP;
const DEFAULT_CAMPAIGN_ACTION = require('../field/field-campaign').DEFAULT_CAMPAIGN_ACTION;


describe('field.campaign', () => {
  let logger = new Logger({toConsole: false});

  class TypeLookup extends Lookup {
    async campaign(fieldName, type, defaults, data) {
      if (type === 'x') {
        return 123
      }
      return super.campaign(fieldName, type, defaults, data);
    }
    async campaignGroup(fieldName, group, defaults, data) {
      if (group === 'xx') {
        return 123
      }
      return super.campaignGroup(fieldName, group, defaults, data);
    }

    async campaignAction(fieldName, action, defaults, data) {
      if (action === 'test') {
        return 123
      }
      return super.campaignAction(fieldName, action, defaults, data);

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

  describe('action', () => {
    logger.clear();
    it('translate default', async () => {
      let r = await f.convert('campaign', {title: 'zeeland'}, logger);
      assert.equal(r.actionId, DEFAULT_CAMPAIGN_ACTION, 'found default')
    });
    it('translate value', async () => {
      let r = await f.convert('campaign', {title: 'zeeland', action: 'test'}, logger);
      assert.equal(r.actionId, 123, 'found group')
    });
  })

});

