
const FieldLocator = require('./field-locator').FieldLocator;
const FieldTextBoolean = require('./field-text-boolean').FieldTextBoolean;
const FieldLocatorText = require('./field-locator').FieldLocatorText;
const FieldLocatorGuid = require('./field-locator').FieldLocatorGuid;
const _ = require('lodash');

class FieldLocatorContact extends FieldLocator {

  constructor(options = {}) {
    super(options);
    this._fields = _.merge(this._fields, {
      id: new FieldLocatorGuid({ emptyAllow: false}),
      fullName: new FieldLocatorText({ emptyAllow: false}),
      firstName: new FieldLocatorText({emptyAllow: false}),
      namePrefix: new FieldLocatorText({emptyAllow: false}),
      name: new FieldLocatorGuid({emptyAllow: false}),
      subName: new FieldLocatorText({emptyAllow: false}),
      guid: new FieldLocatorGuid({ emptyAllow: false}),
      search: new FieldLocatorText({ emptyAllow: false}),
      typeId: new FieldLocatorText({ emptyAllow: false}),
      type: new FieldLocatorText({ emptyAllow: false}),
      // do a lookup on the email adress
      email: new FieldLocatorText({emptyAllow: false}),
      // if true and there are multiple parents the first one is used
      _allowMulti: new FieldTextBoolean(({emptyAllow: true}))
    });
    this._fields.organisation = this._fields.name;
    this.addStoreGroup('fullName');
    this.addStoreGroup('name');
    this.addStoreGroup('guid');
    this.addStoreGroup('email');
    this.addStoreGroup('search');
    this.addStoreGroup('id')
  }


  async processKeys(fieldName, fields, data, logger) {
    // check for tha fake organisationn field
    if (data.organisation) {
      data.name = data.organisation
      fields.name = fields.organisation
    }
    return super.processKeys(fieldName, fields, data, logger)
  }
}

module.exports.FieldLocatorContact = FieldLocatorContact;
