
const FieldObject = require('./field-object').FieldObject;
const FieldTextBoolean = require('./field-text-boolean').FieldTextBoolean;
const FieldText = require('./field-text').FieldText;

const _ = require('lodash');

class FieldLocator extends FieldObject {

  constructor(options = {}) {
    super(options);
    this._fields = _.merge(this._fields, {
      _sync : new FieldTextBoolean(),
      fullName: new FieldText(),
      search: new FieldText(),
      typeId: new FieldText(),
      type: new FieldText(),
    });
  }
}

module.exports.FieldLocator = FieldLocator;
