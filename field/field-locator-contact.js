
const FieldLocator = require('./field-locator').FieldLocator;
const FieldTextBoolean = require('./field-text-boolean').FieldTextBoolean;
const FieldLocatorText = require('./field-locator').FieldLocatorText;
const FieldLocatorGuid = require('./field-locator').FieldLocatorGuid;
const NameParse = require('../lib/name-parser').ParseFullName;
const _ = require('lodash');

class FieldLocatorContact extends FieldLocator {

  constructor(options = {}) {
    super(options);
    this._fields = _.merge(this._fields, {
      id: new FieldLocatorGuid(),
      fullName: new FieldLocatorText(),
      trueName: new FieldLocatorText(),
      firstName: new FieldLocatorText(),
      namePrefix: new FieldLocatorText(),
      name: new FieldLocatorGuid(),
      subName: new FieldLocatorText(),
      guid: new FieldLocatorGuid(),
      search: new FieldLocatorText(),
      typeId: new FieldLocatorText(),
      type: new FieldLocatorText(),
      // do a lookup on the email adress
      email: new FieldLocatorText(),
      // do a lookup on the sourceId
      sourceId: new FieldLocatorText(),
      // if true and there are multiple parents the first one is used
      _allowMulti: new FieldTextBoolean()
    });
    this._fields.organisation = this._fields.name;
    this.addStoreGroup('trueName');
    this.addStoreGroup('fullName');
    this.addStoreGroup('name');
    this.addStoreGroup('guid');
    this.addStoreGroup('email');
    this.addStoreGroup('sourceId');
    this.addStoreGroup('search');
    this.addStoreGroup('id')
  }


  async processKeys(fieldName, fields, data, logger) {
    // check for tha fake organisationn field
    if (data.organisation) {
      data.name = data.organisation
      fields.name = fields.organisation
    } else if (data.trueName) {
      // split Erick de Boer into fullName: Boer, Erick de
      let parser = new NameParse();
      let parsed = parser.analyse(data.trueName);
      if (parsed.error.length) {
        this.log(logger, 'warn', fieldName + 'trueName', parsed.error.join(', '));
      }
      const mapping = {
        last: 'name',
        first: 'firstName',
        middle: 'middleName',
        nick: 'nickName',
        // what to do with the middle name and nick
        title: 'title',
        prefix: 'namePrefix',
        suffix: 'nameSuffix'
      };
      let foundData = {};
      for (let field in mapping) {
        if (parsed[field].length) {
          foundData[mapping[field]] = parsed[field].trim();
        }
      }
      delete data.trueName;
      data.fullName = foundData.name + ', ' + foundData.firstName + ( foundData.middleName? ` ${foundData.middleName}` : '') + (foundData.namePrefix ? ` ${foundData.namePrefix}` : '');
    }
    return super.processKeys(fieldName, fields, data, logger)
  }
}

module.exports.FieldLocatorContact = FieldLocatorContact;
