
const FieldLocator = require('./field-locator').FieldLocator;
const _ = require('lodash');
const FieldText = require('./field-text').FieldText;
const FieldTextGuid = require('./field-text').FieldTextGuid;


class FieldLocatorCampaign extends FieldLocator {

  constructor(options = {}) {
    super(options);
    this._fields = _.merge(this._fields, {
      title: new FieldText(),
      id: new FieldTextGuid(),
      guid: new FieldTextGuid()
    });
  }
}

module.exports.FieldLocatorCampaign = FieldLocatorCampaign;
