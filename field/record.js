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
const FieldUrl = require('./field-url').FieldUrl;
const FieldTelephone = require('./field-telephone').FieldTelephone;
const FieldCode = require('./field-code').FieldCode;
const FieldExtra = require('./field-extra').FieldExtra;
const FieldMemo = require('./field-memo').FieldMemo;
const FieldCampaign = require('./field-campaign').FieldCampaign;
const FieldCampaignCode = require('./field-campaign-code').FieldCampaignCode;
const FieldCampaignContact = require('./field-campaign-contact').FieldCampaignContact;
const _ = require('lodash');
const Lookup = require('../lib/lookup');

class AdrezRecord extends FieldObject {

  constructor(options = {}){
    if (!options) { options = {}}
    super(options);
    this._name = 'record';
    this._lookup = options.lookup ? options.lookup : new Lookup();

    this._fields = {
      // id = synId
      id: new FieldGuid(),
      // contactId is the true address id
      contactId: new FieldGuid(),  // the sync in the address2code
      adrezId: new FieldGuid(),    // the true addressId in the address table. Overrules the contactId
      _rowIndex : new FieldGuid(),

      contact:      new FieldArray( { type: new FieldContact(_.merge({lookup: this._lookup}, options, options.contact)) }, options),
      email:        new FieldArray( { type: new FieldEmail(_.merge({lookup: this._lookup}, options, options.email)) }, options),
      url:          new FieldArray( { type: new FieldUrl(_.merge({lookup: this._lookup}, options, options.url)) }, options),
      telephone:    new FieldArray( { type: new FieldTelephone(_.merge({lookup: this._lookup}, options, options.telephone)) } , options),
      location:     new FieldArray( { type: new FieldLocation(_.merge({lookup: this._lookup}, options, options.location)) }, options),
      code:         new FieldArray( { type: new FieldCode(_.merge({lookup: this._lookup}, options, options.code)) }, options),
      extra:        new FieldArray( { type: new FieldExtra(_.merge({lookup: this._lookup}, options, options.extra))}, options),
      memo:         new FieldArray( { type: new FieldMemo(_.merge({lookup: this._lookup}, options, options.memo)) }, options ),
      campaign:     new FieldArray({ type: new FieldCampaign(_.merge({lookup: this._lookup}, options, options.campaign)) }, options ),
      campaignCode: new FieldArray({ type: new FieldCampaignCode(_.merge({lookup: this._lookup}, options, options.campaignCode)) }, options ),
      campaignContact: new FieldArray({ type: new FieldCampaignContact(_.merge({lookup: this._lookup}, options, options.campaignContact)) }, options ),
    }
  }

  get lookup() {
    return this._lookup;
  }

  async convert(fieldName, data, logger = false, parent = false) {
    // check every key is an array
    for (let key in data) {
      if (!data.hasOwnProperty(key)) { continue }
      if (['id','contactId','_rowIndex', 'adrezId'].indexOf(key) >= 0) {
        continue;
      }
      if (!Array.isArray(data[key])) {
        data[key] = [data[key]]
      }
    }
    return await super.convert(fieldName, data, logger, parent)
  }
  }

module.exports.AdrezRecord = AdrezRecord;
