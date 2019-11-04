/**
 * array
 */

const FieldObject = require('./field-object').FieldObject;
const FieldGuid = require('./field-text').FieldTextGuid;
const FieldText = require('./field-text').FieldText;
const FieldArray = require('./field-array').FieldArray;
const FieldContact  = require('./field-contact').FieldContact;
const FieldLocation = require('./field-location').FieldLocation;
const FieldEmail = require('./field-email').FieldEmail;
const FieldTelephone = require('./field-telephone').FieldTelephone;
const FieldCode = require('./field-code').FieldCode;
const FieldExtra = require('./field-extra').FieldExtra;
const FieldMemo = require('./field-memo').FieldMemo;
const FieldCampaign = require('./field-campaign').FieldCampaign;
const FieldCampaignCodes = require('./field-campaign-code').FieldCampaignCode;
const _ = require('lodash');
const Lookup = require('../lib/lookup');

class AdrezRecord extends FieldObject {

  constructor(options = {}){
    if (!options) { options = {}}
    super(options);
    this._name = 'record';
    this._lookup = options.lookup ? options.lookup : new Lookup();

    this._fields = {
      id: new FieldGuid(),

      contact:      new FieldArray( { type: new FieldContact(_.merge({lookup: this._lookup}, options, options.contact)) }, options),
      email:        new FieldArray( { type: new FieldEmail(_.merge({lookup: this._lookup}, options, options.email)) }, options),
      telephone:    new FieldArray( { type: new FieldTelephone(_.merge({lookup: this._lookup}, options, options.telephone)) } , options),
      location:     new FieldArray( { type: new FieldLocation(_.merge({lookup: this._lookup}, options, options.location)) }, options),
      code:         new FieldArray( { type: new FieldCode(_.merge({lookup: this._lookup}, options, options.code)) }, options),
      extra:        new FieldArray( { type: new FieldExtra(_.merge({lookup: this._lookup}, options, options.extra))}, options),
      memo:         new FieldArray( { type: new FieldMemo(_.merge({lookup: this._lookup}, options, options.memo)) }, options ),
      campaign:     new FieldCampaign({ type: new FieldMemo(_.merge({lookup: this._lookup}, options, options.campaign)) }, options ),
      campaignCode: new FieldCampaignCodes({ type: new FieldMemo(_.merge({lookup: this._lookup}, options, options.campaignCode)) }, options ),
    }
  }

  get lookup() {
    return this._lookup;
  }

}

module.exports.AdrezRecord = AdrezRecord;
