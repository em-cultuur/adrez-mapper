
const FieldLocator = require('./field-locator').FieldLocator;
const _ = require('lodash');
const FieldText = require('./field-text').FieldText;
const FieldTextGuid = require('./field-text').FieldTextGuid;


class FieldLocatorCampaign extends FieldLocator {

  constructor(options = {}) {
    super(options);
    this.emptyAllow = false;
    this._fields = _.merge(this._fields, {
      title: new FieldText(options),
      id: new FieldTextGuid(options),
      guid: new FieldTextGuid(options)
    });
  }
}

module.exports.FieldLocatorCampaign = FieldLocatorCampaign;
