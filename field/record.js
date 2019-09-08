/**
 * array
 */

const FieldObject = require('./field-object').FieldObject;
const FieldGuid = require('./field-text').FieldGuid;
const FieldText = require('./field-text').FieldText;
const FieldArray = require('./field-array').FieldArray;
const FieldContact  = require('./field-contact').FieldContact;
const FieldLocation = require('./field-location').FieldLocation;
const FieldEmail = require('./field-email').FieldEmail;
const FieldTelephone = require('./field-telephone').FieldTelephone;
const FieldCode = require('./field-code').FieldCode;
const FieldExtra = require('./field-extra').FieldExtra;
const FieldMemo = require('./field-memo').FieldMemo;
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
//      sync: new FieldText({emptyAllow: true}),
//      sourceId: new FieldText({emptyAllow: true}),

      contact:      new FieldArray( { type: new FieldContact(_.merge({lookup: this._lookup}, options.contact)) }),
      email:        new FieldArray( { type: new FieldEmail(_.merge({lookup: this._lookup}, options.email)) }),
      telephone:    new FieldArray( { type: new FieldTelephone(_.merge({lookup: this._lookup}, options.telephone)) } ),
      location:     new FieldArray( { type: new FieldLocation(_.merge({lookup: this._lookup}, options.location)) }),
      code:         new FieldArray( { type: new FieldCode(_.merge({lookup: this._lookup}, options.code)) }),
      extra:        new FieldArray( { type: new FieldExtra(_.merge({lookup: this._lookup}, options.extra))}),
      memo:         new FieldArray( { type: new FieldMemo(_.merge({lookup: this._lookup}, options.memo)) } )

    }
  }

  get lookup() {
    return this._lookup;
  }

}

module.exports.AdrezRecord = AdrezRecord;