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
const FieldMemo = require('./field-memo').FieldMemo;


class AdrezRecord extends FieldObject {

  constructor(options = {}){
    super(options);
    this._name = 'record';
    this._fields = {
      id: new FieldGuid(),
      sync: new FieldText({emptyAllow: true}),
      sourceId: new FieldText({emptyAllow: true}),

      contact:      new FieldArray( { type: new FieldContact() }),
      email:        new FieldArray( { type: new FieldEmail() }),
      telephone:    new FieldArray( { type: new FieldTelephone() } ),
      location:     new FieldArray( { type: new FieldLocation() }),
      code:         new FieldArray( { type: new FieldCode() }),
      memo:         new FieldArray( { type: new FieldMemo()} )
    }
  }

}

module.exports.AdrezRecord = AdrezRecord;