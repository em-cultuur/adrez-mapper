
const FieldLocator = require('./field-locator').FieldLocator;
// const FieldTextBoolean = require('./field-text-boolean').FieldTextBoolean;
const FieldText = require('./field-text').FieldText;
const FieldGuid = require('./field-text').FieldTextGuid;
const _ = require('lodash');

class FieldLocatorContact extends FieldLocator {

  constructor(options = {}) {
    super(options);
    this._fields = _.merge(this._fields, {
      // _sync : new FieldTextBoolean(),
      id: new FieldGuid(),
      fullName: new FieldText(),
      guid: new FieldGuid(),
      search: new FieldText(),
      typeId: new FieldText(),
      type: new FieldText(),
    });
  }
}

module.exports.FieldLocatorContact = FieldLocatorContact;
