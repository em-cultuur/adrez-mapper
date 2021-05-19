/*
 * The campaign record
 */

const FieldComposed = require('./field-composed').FieldComposed;
const FieldText = require('./field-text').FieldText;
const FieldGuid = require('./field-text').FieldTextGuid;
const FieldDate = require('./field-text-date').FieldTextDate;
const FieldBoolean = require('./field-text-boolean').FieldTextBoolean;
const FieldLocatorCampaign = require('./field-locator-campaign').FieldLocatorCampaign;

const DEFAULT_CAMPAIGN_TYPE = 0;
const DEFAULT_CAMPAIGN_GROUP = 0;
const DEFAULT_CAMPAIGN_ACTION = 0;

class FieldCampaign extends FieldComposed {
  constructor(options = {}) {
    super(options);
    this.baseTypeId = DEFAULT_CAMPAIGN_TYPE;
    // the lookup is for the action because its the relation between the campaign an the contact
    this.lookupFunctionName = 'campaign';
    // source / sourceId is stored in type / typeId
    this._fields.guid = new FieldGuid();
    this._fields.title = new FieldText({emptyAllow: false});
    this._fields.campaignDate = new FieldDate();
    this._fields.isActive = new FieldBoolean();
    this._fields.description = new FieldText({emptyAllow: false});
    this._fields.group = new FieldText({emptyAllow: true});
    this._fields.groupId = new FieldGuid();
    this._fields.groupGuid = new FieldGuid();
    // the action that added to campaignContact
    // typeId is used for the sourceId in Adrez, so we need to call it twice
    this._fields.actionId = new FieldText({emptyAllow: true});
    this._fields.actionGuid = new FieldGuid({emptyAllow: true});
    this._fields.action = new FieldText();
    // this._fields.action = this._fields.type;
    // this._fields.actionId = this._fields.typeId;
    // this._fields.actionGuid = this._fields.typeGuid;

    this._fields._key = new FieldText({emptyAllow: true});

    this._fields.locator = new FieldLocatorCampaign({emptyAllow: false});
    this.emptyValueAllowed = true;
    this.addStoreGroup('title')
  }


  /**
   * just process all keys individual
   *
   * @param fieldName
   * @param fields the field parsers
   * @param data the data given
   * @param logger Class where to store the errors
   */
  async processKeys(fieldName, fields, data, logger) {
    let result = {};
    if (data.actionId === undefined) {
      let codeDef = {
        id: data.actionId,
        guid: data.actionGuid,
        text: data.action,
      };
    }

    result.groupId = await this.lookupCode(data, 'campaignGroup', 'group', 'group', 0, logger);
    // do the second lookup for the action
    result.actionId = await this.lookupCode(data, 'campaignContact', 'action', 'action', 0, logger)

    result.campaignDate = data.campaignDate; // ? data.campaignDate : ('' + new Date());

    this.copyFieldsToResult(result, data, ['group', 'action']);
    if (data.locator) {
      if (fields.locator) {
        result.locator = await fields.locator.convert(fieldName + '.locator', data.locator, logger);
      } else {
        // locator was removed because no valid field
        this.log(logger, 'error', `locator ${fieldName}.locator is empty`);
      }
    }

    let cFields = this.remapFields(result);
    return super.processKeys(fieldName, cFields, result, logger);
  }
}

module.exports.FieldCampaign = FieldCampaign;
module.exports.DEFAULT_CAMPAIGN_TYPE = DEFAULT_CAMPAIGN_TYPE;
module.exports.DEFAULT_CAMPAIGN_GROUP = DEFAULT_CAMPAIGN_GROUP;
module.exports.DEFAULT_CAMPAIGN_ACTION = DEFAULT_CAMPAIGN_ACTION;
