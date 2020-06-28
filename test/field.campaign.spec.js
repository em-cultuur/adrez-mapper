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
    async campaign(fieldName, def) {
      if (def.text === 'x') {
        return 123
      }
      if (def.guid === 'TYPE_GUID') {
        return 4
      }
      return super.campaign(fieldName, def);
    }

    async campaignGroup(fieldName, def) {
      if (def.text === 'xx') {
        return 123
      }
      return super.campaignGroup(fieldName, def);
    }

    async campaignAction(fieldName, def) {
      if (def.guid === 'ACT_GUID') {
        return 3;
      }
      if (def.text === 'test') {
        return 123
      }
      return super.campaignAction(fieldName, def);

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
      let r = await f.convert('campaign', {title: 'zeeland', type: 'alg', typeGuid: 'TYPE_GUID',  action: 'someAction', actionGuid: 'ACT_GUID'}, logger);
      assert.equal(r.actionId, 3, 'found address2campaign');
      assert.equal(r.typeId, 4)
    });
  });

  describe('locator', () =>  {
    it('parse', async () => {
      let r = await f.convert('campaign', {title: 'Working it', locator: { guid: 'c.123' }}, logger);
      assert.isDefined(r.locator, 'has locator');
      assert.isDefined(r.locator.guid, 'c.123');
    })
  })
});

