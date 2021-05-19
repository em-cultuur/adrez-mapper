const Chai = require('chai');
const assert = Chai.assert;
const _ = require('lodash');
const Logger = require('logger');
const Lookup = require('../lib/lookup');
const FieldCampaign = require('../field/field-campaign').FieldCampaign;
const FieldCampaignCode = require('../field/field-campaign-code').FieldCampaignCode;
const FieldCampaignContact = require('../field/field-campaign-contact').FieldCampaignContact;
const FieldCode = require('../field/field-code').FieldCode;
const FieldContact = require('../field/field-contact').FieldContact;
const FieldEmail = require('../field/field-email').FieldEmail;
const FieldExtra = require('../field/field-extra').FieldExtra;
const FieldLocation = require('../field/field-location').FieldLocation;
const FieldLocatorCampaign = require('../field/field-locator-campaign').FieldLocatorCampaign;
const FieldLocatorContact = require('../field/field-locator-contact').FieldLocatorContact;
const FieldMemo = require('../field/field-memo').FieldMemo;
const FieldTelephone = require('../field/field-telephone').FieldTelephone;
const FieldUrl = require('../field/field-url').FieldUrl;

describe('field.is-empty', () => {
  let logger = new Logger({toConsole: false});
  const VALUE = 'test-value'
  const RESULT = '123'
  let result;

  class TypeLookup extends Lookup {
    async campaignCode(fieldName, def) {
      if (def.text === VALUE) {
        return RESULT
      }
      return super.campaignCode(fieldName, def);
    }

    async code(fieldName, def) {
      if (def.text === VALUE) {
        return RESULT
      }
      // code can NEVER have a default value, because otherwise it will ALWAYS be added
      return undefined;
    }
  }


  it('field.campaign', async () => {
    let f = new FieldCampaign();

    result = await f.convert('fieldCampaign', {title: VALUE});
    assert.equal(result.title, VALUE);
    result = await f.convert('fieldCampaign', {guid: VALUE});
    assert.isTrue(_.isEmpty(result))
  });

  it('field.campaignCode', async () => {
    let f = new FieldCampaignCode({lookup: new TypeLookup()});
    result = await f.convert('fieldCampaignCode', {code: VALUE});
    assert.equal(result.typeId, RESULT)
    result = await f.convert('fieldCampaignCode', {type: VALUE});
    assert.equal(result.typeId, RESULT);
    result = await f.convert('fieldCampaignCode', {typeId: RESULT});
    assert.equal(result.typeId, RESULT);
    result = await f.convert('fieldCampaignCode', {codeId: RESULT});
    assert.equal(result.typeId, RESULT);
    result = await f.convert('fieldCampaignCode', {_remove: true});
    assert.isTrue(_.isEmpty(result))
  })

  it('field.campaignContact', async () => {
    let f = new FieldCampaignContact({lookup: new TypeLookup()});
    result = await f.convert('fieldCampaignContact', {contact: VALUE});
    assert.equal(result.contact, VALUE)
    result = await f.convert('fieldCampaignContact', {campaign: VALUE});
    assert.isTrue(_.isEmpty(result))
  })

  it('field.code', async () => {
    let f = new FieldCode({lookup: new TypeLookup()});
    result = await f.convert('fieldCode', {code: VALUE});
    assert.equal(result.typeId, RESULT)
    result = await f.convert('fieldCode', {type: VALUE});
    assert.equal(result.typeId, RESULT);
    result = await f.convert('fieldCode', {typeId: RESULT});
    assert.equal(result.typeId, RESULT);
    result = await f.convert('fieldCode', {codeId: RESULT});
    assert.equal(result.typeId, RESULT);
    result = await f.convert('fieldCode', {_remove: true});
    assert.isTrue(_.isEmpty(result))
  })

  it('field.contact', async () => {
    let f = new FieldContact({lookup: new TypeLookup()});
    result = await f.convert('fieldContact', {name: VALUE});
    assert.equal(result.name, VALUE)
    result = await f.convert('fieldContact', {organisation: VALUE});
    assert.equal(result.name, VALUE)
    result = await f.convert('fieldContact', {firstName: VALUE});
    assert.isTrue(_.isEmpty(result))
  })

  it ('field.email', async() => {
    let f = new FieldEmail({lookup: new TypeLookup()});
    result = await f.convert('fieldContact', {email: 'info@test.com'});
    assert.equal(result.value, 'info@test.com')
    result = await f.convert('fieldContact', {typeId: VALUE, email: undefined});
    assert.isTrue(_.isEmpty(result))
  })

  it ('field.extra', async() => {
    let f = new FieldExtra({lookup: new TypeLookup()});
    result = await f.convert('fieldExtra', {text: VALUE});
    assert.equal(result.text, VALUE)
    result = await f.convert('fieldExtra', {description: VALUE});
    assert.equal(result.description, VALUE)
    result = await f.convert('fieldExtra', {boolean: VALUE});
    assert.equal(result.text, '1')
    result = await f.convert('fieldExtra', {number: 123});
    assert.equal(result.text, '123')
    result = await f.convert('fieldExtra', {date: '01/07/2021'});
    assert.equal(result.text, '01/07/2021')
    result = await f.convert('fieldExtra', {money: '12,22'});
    assert.equal(result.text, '12,22')
    result = await f.convert('fieldExtra', {list: '1,2,3,4'});
    assert.equal(result.description, '1,2,3,4')
    result = await f.convert('fieldExtra', {image: 'test.png'});
    assert.equal(result.text, 'test.png');
    result = await f.convert('fieldExtra', {multi: 'so what'});
    assert.equal(result.description, 'so what');


    result = await f.convert('fieldExtra', {typeId: VALUE});
    assert.isTrue(_.isEmpty(result));
  })

  it ('field.location', async() => {
    let f = new FieldLocation({lookup: new TypeLookup()});
    result = await f.convert('fieldLocation', {street: VALUE, city: VALUE});
    assert.equal(result.street, VALUE)
    result = await f.convert('fieldLocation', {street: VALUE});
    assert.isTrue(_.isEmpty(result));
    result = await f.convert('fieldLocation', {city: VALUE});
    assert.isTrue(_.isEmpty(result));
    result = await f.convert('fieldLocation', {zipcode: VALUE, number: VALUE});
    assert.equal(result.zipcode, VALUE)
    result = await f.convert('fieldLocation', {zipcode: VALUE});
    assert.isTrue(_.isEmpty(result));
    result = await f.convert('fieldLocation', {streetNumber: VALUE, city: VALUE});
    assert.equal(result.city, VALUE)
  });

  it ('field.locator-campaign', async() => {
    let f = new FieldLocatorCampaign({lookup: new TypeLookup()});
    result = await f.convert('fieldLocatorCampaign', {title: VALUE});
    assert.equal(result.title, VALUE)
    result = await f.convert('fieldLocatorCampaign', {guid: VALUE});
    assert.equal(result.guid, VALUE)
    result = await f.convert('fieldLocatorCampaign', {id: VALUE});
    assert.equal(result.id, VALUE)
    // there is no not required field ...
  })

  it ('field.locator-contact', async() => {
    let f = new FieldLocatorContact({lookup: new TypeLookup()});
    result = await f.convert('fieldLocatorContact', {name: VALUE});
    assert.equal(result.name, VALUE);
    result = await f.convert('fieldLocatorContact', {guid: VALUE});
    assert.equal(result.guid, VALUE);
    result = await f.convert('fieldLocatorContact', {organisation: VALUE});
    assert.equal(result.name, VALUE);
    result = await f.convert('fieldLocatorContact', {email: VALUE});
    assert.equal(result.email, VALUE);
    result = await f.convert('fieldLocatorContact', {search: VALUE});
    assert.equal(result.search, VALUE);
    result = await f.convert('fieldLocatorContact', {id: VALUE});
    assert.equal(result.id, VALUE);
    result = await f.convert('fieldLocatorContact', {firstName: VALUE});
    assert.isTrue(_.isEmpty(result));
  })

  it ('field.memo', async() => {
    let f = new FieldMemo({lookup: new TypeLookup()});
    result = await f.convert('fieldMemo', {text: VALUE});
    assert.equal(result.text, VALUE);
    result = await f.convert('fieldMemo', {description: VALUE});
    assert.equal(result.description, VALUE);
    result = await f.convert('fieldMemo', {type: VALUE});
    assert.isTrue(_.isEmpty(result));
  })

  it ('field.telephone', async() => {
    let f = new FieldTelephone({lookup: new TypeLookup()})
    result = await f.convert('fieldTelephone', {telephone: undefined});
    assert.isTrue(_.isEmpty(result));

    result = await f.convert('fieldTelephone', {telephone: VALUE});
    assert.equal(result.value, VALUE + ' #import');
    result = await f.convert('fieldTelephone', {telephoneInt: VALUE});
    assert.equal(result.value, VALUE + ' #import');
    result = await f.convert('fieldTelephone', {telephone10: VALUE});
    assert.equal(result.value, VALUE + ' #import');
    result = await f.convert('fieldTelephone', {telephone10Int: VALUE});
    assert.equal(result.value, VALUE + ' #import');

  });

  it ('field.url', async() => {
    let f = new FieldUrl({lookup: new TypeLookup()})
    result = await f.convert('fieldUrl', {url: VALUE});
    assert.equal(result.value, VALUE);
    result = await f.convert('fieldUrl', {Facebook: VALUE});
    assert.equal(result.value, VALUE);
    result = await f.convert('fieldUrl', {Twitter: VALUE});
    assert.equal(result.value, VALUE);
    result = await f.convert('fieldUrl', {url: undefined});
    assert.isTrue(_.isEmpty(result));
  })
});
