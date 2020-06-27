const Chai = require('chai');
const assert = Chai.assert;
const _ = require('lodash');
const Logger = require('logger');
const Lookup = require('../lib/lookup');
const FieldCampaignContact = require('../field/field-campaign-contact').FieldCampaignContact;

describe('field.campaign-contact', () => {
  let logger = new Logger({toConsole: false});

// Example of the def
//   let codeDef = {
//     // the code we want to find. Text is store in the result.type
//     id: data.typeId,
//     guid: data.typeGuid,
// //          text: data.type,
//     fieldTypeId: data.fieldTypeId,
//     fieldTypeGuid: data.fieldTypeGuid,
//     fieldTypeInsertOnly: data.hasOwnProperty('typeInsertOnly') ? !! data.typeInsertOnly : false,
//
//     // the data to create the parent if it does not exist
//     parentIdDefault: this.baseTypeId,
//     parentId: data.parentId,
//     parentGuid: data.parentGuid,
//     parentText: data.parentText,
//     data: data
//   };
  class TypeLookup extends Lookup {
    async campaignContact(fieldName, def) {
      if (def.text === 'aangemeld') {
        return '123'
      } else if (def.text === 'test') {
        return 4;
      }
      return Promise.resolve(0);
    }
  }

  let f = new FieldCampaignContact({
    lookup: new TypeLookup()
  });

  describe('type/source',  () => {
    logger.clear();
    it('translate default', async () => {
      let r = await f.convert('campaigncontact', {type: 'test'}, logger);
      assert.equal(r.typeId, 4, 'found default');
    });
    it('translate value', async () => {
      let r = await f.convert('campaigncontact', {campaign: 'test', type: 'aangemeld', contact: 'user'}, logger);
      assert.equal(r.typeId, '123', 'found default')
      assert.equal(r.campaign, 'test')
      assert.equal(r.contact, 'user')
    });

    it('empty value', async () => {
      let r = await f.convert('campaigncontact', {campaign: 'test', contact: 'jan', code: undefined}, logger);
      assert.isUndefined(r.typeId, 'no type');
    });

  });

});
