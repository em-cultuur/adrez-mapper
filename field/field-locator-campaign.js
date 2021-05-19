
const FieldLocator = require('./field-locator').FieldLocator;
const _ = require('lodash');
const FieldLocatorText = require('./field-locator').FieldLocatorText
const FieldLocatorGuid = require('./field-locator').FieldLocatorGuid;


class FieldLocatorCampaign extends FieldLocator {

  constructor(options = {}) {
    super(options);
    this.emptyAllow = false;
    this._fields = _.merge(this._fields, {
      title: new FieldLocatorText(options),
      id: new FieldLocatorGuid(options),
      guid: new FieldLocatorGuid(options)
    });
    this.addStoreGroup('guid');
    this.addStoreGroup('title');
    this.addStoreGroup('id');
  }
}

module.exports.FieldLocatorCampaign = FieldLocatorCampaign;
