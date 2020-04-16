const Chai = require('chai');
const assert = Chai.assert;
const _ = require('lodash');
const Logger = require('logger');
const Lookup = require('../lib/lookup');
const FieldCampaignCode = require('../field/field-campaign-code').FieldCampaignCode;

describe('field.campaign-code', () => {
  let logger = new Logger({toConsole: false});

  class TypeLookup extends Lookup {
    async campaignCode(fieldName, def) {
      if (def.text === 'uitnodiging') {
        return '123'
      }
      return super.campaignCode(fieldName, def);
    }
  }

  let f = new FieldCampaignCode({
    lookup: new TypeLookup()
  });

  describe('type/source',  () => {
    logger.clear();
    it('use guid', async() => {
      let r = await f.convert('campaignCode',   { "_parent": "campaign", "code": "uitnodiging", codeGuid: 'CC_TEST' });
      assert.equal(r.typeId, '123', 'found default')
      assert.equal(r.typeGuid, 'CC_TEST');
      r = await f.convert('campaignCode',   { "_parent": "campaign", "code": "uitnodiging", typeGuid: 'CC_TEST' });
      assert.equal(r.typeId, '123', 'found default')
      assert.equal(r.typeGuid, 'CC_TEST');

    });

    it('translate default', async () => {
      let r = await f.convert('campaigncode', {code: 'test', _parent: 'test'}, logger);
      assert.equal(r.typeId, 62, 'found default');
      assert.equal(r._parent, 'test', 'did store test')
    });
    it('translate value', async () => {
      let r = await f.convert('campaigncode', {code: 'uitnodiging'}, logger);
      assert.equal(r.typeId, '123', 'found default')
    });

    it('use type', async () => {
      let r = await f.convert('campaignCode',   { "_parent": "campaign", "code": "uitnodiging" });
      assert.equal(r.typeId, '123', 'found default')
    });


  });

});
