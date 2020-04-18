
const FieldLocator = require('./field-locator').FieldLocator;
// const FieldTextBoolean = require('./field-text-boolean').FieldTextBoolean;
const FieldLocatorText = require('./field-locator').FieldLocatorText;
const FieldLocatorGuid = require('./field-locator').FieldLocatorGuid;
const _ = require('lodash');

class FieldLocatorContact extends FieldLocator {

  constructor(options = {}) {
    super(options);
    this._fields = _.merge(this._fields, {
      // _sync : new FieldTextBoolean(),
      id: new FieldLocatorGuid({ emptyAllow: false}),
      fullName: new FieldLocatorText({ emptyAllow: false}),
      name: new FieldLocatorGuid({emptyAllow: false}),
      subName: new FieldLocatorText({emptyAllow: false}),
      guid: new FieldLocatorGuid({ emptyAllow: false}),
      search: new FieldLocatorText({ emptyAllow: false}),
      typeId: new FieldLocatorText({ emptyAllow: false}),
      type: new FieldLocatorText({ emptyAllow: false}),
    });
  }
}

module.exports.FieldLocatorContact = FieldLocatorContact;
