/*
 * The campaign record
 */

const FieldComposed = require('./field-composed').FieldComposed;
const FieldText = require('./field-text').FieldText;
const FieldGuid = require('./field-text').FieldTextGuid;
const FieldDate = require('./field-text-date').FieldTextDate;
const FieldBoolean = require('./field-text-boolean').FieldTextBoolean;
const FieldLocatorCampaign = require('./field-locator-campaign').FieldLocatorCampaign;

const DEFAULT_CAMPAIGN_TYPE = 492381;
const DEFAULT_CAMPAIGN_GROUP = 2;
const DEFAULT_CAMPAIGN_ACTION = 9998;

class FieldCampaign extends FieldComposed {
  constructor(options = {}) {
    super(options);
    // source / sourceId is stored in type / typeId
    this._fields.title = new FieldText();
    this._fields.campaignDate = new FieldDate();
    this._fields.isActive = new FieldBoolean();
    this._fields.description = new FieldText();
    this._fields.group = new FieldText();
    this._fields.groupId = new FieldGuid();
    // the action that added to campaignContact
    this._fields.actionId = new FieldText();
    this._fields.action = new FieldText();

    this._fields._key = new FieldText({emptyAllow: true});

    this._fields.locator = new FieldLocatorCampaign();
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
    // translate the type of campaign
    if (data.typeId === undefined) {
      result.typeId = await this.lookup.campaign(fieldName, data.type, DEFAULT_CAMPAIGN_TYPE, data)
      data.typeId = result.typeId;
    } else {
      result.typeId = data.typeId;
    }
    if (data.groupId === undefined) {
      result.groupId = await this.lookup.campaignGroup(fieldName, data.group, DEFAULT_CAMPAIGN_GROUP, data)
      data.groupId = result.groupId;
    } else {
      result.groupId = data.groupId;
    }
    if (data.actionId === undefined) {
      result.actionId = await this.lookup.campaignAction(fieldName, data.action, DEFAULT_CAMPAIGN_ACTION, data);
    } else {
      result.actionId = data.actionId;
    }


    result.campaignDate = data.campaignDate ? data.campaignDate : ('' + new Date());

    this.copyFieldsToResult(result, data, ['type', 'group', 'action']);
    let cFields = this.remapFields(result);
    return super.processKeys(fieldName, cFields, result, logger);
  }
}

module.exports.FieldCampaign = FieldCampaign;
module.exports.DEFAULT_CAMPAIGN_TYPE = DEFAULT_CAMPAIGN_TYPE;
module.exports.DEFAULT_CAMPAIGN_GROUP = DEFAULT_CAMPAIGN_GROUP;
module.exports.DEFAULT_CAMPAIGN_ACTION = DEFAULT_CAMPAIGN_ACTION;
