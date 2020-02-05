/*
 * The campaign code record
 */

const FieldCode = require('./field-code').FieldCode;

class FieldCampaignCode extends FieldCode {
  constructor(options = {}) {
    super(options);
    this.lookupFunctionName = 'campaignCode';
    this.baseTypeId = 10; // TODO: what is the base code for the campaigns??????
  }
}
module.exports.FieldCampaignCode = FieldCampaignCode;
