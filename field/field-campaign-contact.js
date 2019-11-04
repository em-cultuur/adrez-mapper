/*
 * The campaign to contact
 */

const FieldComposed = require('./field-composed').FieldComposed;
const FieldText = require('./field-text').FieldText;

class FieldCampaignCode extends FieldComposed {
  constructor(options = {}) {
    super(options);
    this._fields._campaign = new FieldText({emptyAllow: true});
    this._fields._contact = new FieldText({emptyAllow: true});
    this._fields.text = new FieldText();
  }
  async processKeys(fieldName, fields, data, logger) {
    let result = {};

    // translate the type of campaign
    if (data.typeId === undefined) {
      result.typeId = await this.lookup.campaignContact(fieldName, {type: data.type}, undefined, data)
    } else {
      result.typeId = data.typeId;
    }

    this.copyFieldsToResult(result, data, ['type']);
    let cFields = this.remapFields(result);
    return super.processKeys(fieldName, cFields, result, logger);
  }
}
module.exports.FieldCampaignCode = FieldCampaignCode;
