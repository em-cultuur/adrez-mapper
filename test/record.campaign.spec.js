const Chai = require('chai');
const assert = Chai.assert;
const Logger = require('logger');
const Record = require('../field/record').AdrezRecord;
const Lookup = require('../lib/lookup');

describe('record', () => {
  let logger = new Logger({toConsole: true});

  describe('campaign import',  () => {
    it('campaign', async () => {
      let rec = new Record({removeEmpty: true});
      let data = {
        "id": "854785",
        "contact": [
          {
            "_key": "person",
            "firstName": "Jelle",
            "namePrefix": "de",
            "name": "Boer",
            "locator": {
              "id": "854785"
            }
          }
        ],
        "campaign": [
          {
            "_key": "campaign",
//            "clientName": "zeeland",
            "title": "oesterfeest2020",
            "type": "Campaign Monitor",
            "isActive": true,
            "campaignDate": "2019-11-04T16:23:01.524Z",
            "locator": {
              "id" : "123"
            }
          }
        ]
      };
      let result = await rec.convert('rec', data, logger);
      console.log(logger.messages);
      assert.equal(logger.hasMessages(), false, 'no errors')
      assert.equal(result.id, '854785', 'got id');
      assert.isDefined(result.campaign, 'did get the campaign');
      assert.isTrue(Array.isArray(result.campaign), 'multi result');
      assert.equal(result.campaign.length, 1, 'one element');
      assert.equal(result.campaign[0]._key, 'campaign', 'got the key');
      assert.equal(result.campaign[0].title, 'oesterfeest2020', 'got the title');
      assert.equal(result.campaign[0].isActive, true, 'got the active');
      assert.equal(result.campaign[0].isActive, true, 'got the active');
      assert.equal(result.campaign[0].campaignDate,  "2019-11-04T16:23:01.524Z", 'the date');
      assert.isDefined(result.campaign[0].locator, 'has a locator');
      assert.equal(result.campaign[0].locator.id, '123', 'has a locator');
    })
  });

  describe('campaign error',  () => {
    it('campaign', async () => {
      logger.clear();

      let rec = new Record({removeEmpty: true});
      let data = {
        "campaign": [
          {
            "_key": "campaign",
            "title": "oesterfeest2020",
            "clientName": "zeeland",
            "type": "Campaign Monitor",
            "isActive": true,
            "campaignDate": "2019-11-04T16:23:01.524Z",
            "locator": {
              "id": "123"
            }
          }
        ]
      };
      let result = await rec.convert('rec', data, logger);
      assert.isTrue(logger.hasMessages(), 'has field not found')
    })
  })
});
