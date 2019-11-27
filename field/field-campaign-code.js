/*
 * The campaign record
 */

const FieldCode = require('./field-code').FieldCode;
const FieldText = require('./field-text').FieldText;


class FieldCampaignCode extends FieldCode {
  constructor(options = {}) {
    super(options);
//    delete this._fields.codeId;
//    delete this._fields.groupId;
    this.lookupFunc = 'campaignCode';
  }
}
module.exports.FieldCampaignCode = FieldCampaignCode;
