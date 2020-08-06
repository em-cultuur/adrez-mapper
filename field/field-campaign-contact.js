/*
 * The campaign to contact
 */

const FieldCode = require('./field-code').FieldCode;
const FieldText = require('./field-text').FieldText;
const FieldDate = require('./field-text-date').FieldTextDate;

class FieldCampaignContact extends FieldCode {
  constructor(options = {}) {
    super(options);
    // remove not used
    delete this._fields.codeId;
    delete this._fields.groupId;
    delete this._fields._parent;

    // add ours
   // this._fields.text = new FieldText();
    this._fields.campaign = new FieldText({emptyAllow: true});
    this._fields.contact = new FieldText({emptyAllow: true});
    this._fields.actionDate = new FieldDate({emptyAllow: true})

    this.lookupFunctionName = 'campaignContact';
  }
}
module.exports.FieldCampaignContact = FieldCampaignContact;
