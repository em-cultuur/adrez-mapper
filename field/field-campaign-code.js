/*
 * The campaign code record
 */

const FieldCode = require('./field-code').FieldCode;
const CampaignBaseCode = require('./field-campaign').DEFAULT_CAMPAIGN_GROUP;

class FieldCampaignCode extends FieldCode {
  constructor(options = {}) {
    super(options);
    this.lookupFunctionName = 'campaignCode';
    this.baseTypeId = CampaignBaseCode; // TODO: what is the base code for the campaigns??????
  }
}
module.exports.FieldCampaignCode = FieldCampaignCode;
