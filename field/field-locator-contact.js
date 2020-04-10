
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
      id: new FieldGuid({ emptyAllow: false}),
      fullName: new FieldText({ emptyAllow: false}),
      name: new FieldText(({emptyAllow: false})),
      subName: new FieldText(({emptyAllow: false})),
      guid: new FieldGuid({ emptyAllow: false}),
      search: new FieldText({ emptyAllow: false}),
      typeId: new FieldText({ emptyAllow: false}),
      type: new FieldText({ emptyAllow: false}),
    });
  }
}

module.exports.FieldLocatorContact = FieldLocatorContact;
