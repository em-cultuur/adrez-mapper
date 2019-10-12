/**
 * field-contact
 */

/**
 * Field Compose like email, telephone etc
 */

const FieldText = require('./field-text').FieldText;
const FieldGuid = require('./field-text').FieldGuid;
const FieldBoolean = require('./field-text-boolean').FieldTextBoolean;
const FieldLocator = require('./field-locator').FieldLocator;
// const FieldObject = require('./field-object').FieldObject;
const FieldComposed = require('./field-composed').FieldComposed;
const NameParse = require('../lib/name-parser').ParseFullName;
const _ = require('lodash');

const DEFAULT_FUNCTION = 59470;
const DEFAULT_SALUTATION = 890;
const DEFAULT_ORGANISATION = 101;

class FieldContact extends FieldComposed {

  constructor(options = {}) {
    super(options);
    this._fields = _.merge(this._fields, {
      // fields for the database
      subName: new FieldText(),        // the name of the code
      firstName: new FieldText(),      // the id, overrules the type
      middleName: new FieldText(),
      title: new FieldText(),
      firstLetters : new FieldText(),
      nickName: new FieldText(),
      namePrefix: new FieldText(),
      name: new FieldText(),
      nameSuffix: new FieldText(),

      functionId: new FieldGuid(),
      function: new FieldText(),
      salutationId: new FieldGuid(),
      salutation: new FieldText(),
      isDefault: new FieldBoolean(),

      search: new FieldText(),

      isOrganisation: new FieldBoolean({emptyAllow: true}),
      organisation: new FieldText(),
//      organizationId: new FieldGuid({emptyAllow: true}),
      // key should an other contacts key
      _key: new FieldText({emptyAllow: true}),  // _parent is defined in the composed type
      // if _key is defined the contactId is automatic set
      contactId: new FieldGuid({emptyAllow: true}),

      // used to for calculations
      fullName: new FieldText(),

      _source: new FieldText({emptyAllow: true}),      // the ref to only update our own info
      locator: new FieldLocator()
    });
    // the contact does not know about values
    delete this._fields.value;
    this._parser = new NameParse();
  }

  /**
   * just process all keys individual
   *
   * @param fieldName
   * @param fields the field parsers
   * @param data the data given
   * @param logger Class where to store the errors
   */
  async processKeys(fieldName, fields, data, logger) {
    let result = {};
    if (data.isOrganisation || (data.organisation && data.organisation.length > 0)) {
      if (data.organisation) {
        result.name = data.organisation;
      } else {
        result.name = data.name;
      }
      result.key = data.key;
      result._source = data._source;
      if (data.typeId === undefined) {
        result.typeId = await this.lookup.contact(fieldName, {type: data.type}, DEFAULT_ORGANISATION, data)
      } else {
        result.typeId = data.typeId;
      }
      result.fullName = result.name;
    } else {
      if (fields.fullName && fields.name === undefined) {
        // parse the fullname only if there isn't already a name
        let parsed = this._parser.analyse(data.fullName);
        if (parsed.error.length) {
          this.log(logger, 'warn', fieldName + 'fullName', parsed.error.join(', '));
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
        for (let field in mapping) {
          if (parsed[field].length) {
            data[mapping[field]] = parsed[field];
          }
        }
      }
      if (fields.firstLetters === undefined && data.firstName) {
        if (data.firstName.indexOf('.') > 0) {  // so not J. but Jaap
          data.firstLetters = data.firstName;
          delete data.firstName;
        } else {
          data.firstLetters = data.firstName.substr(0, 1).toUpperCase() + '.'
        }
        if (data.middleName && data.firstLetters.length) {
          data.firstLetters += data.middleName.substr(0, 1).toUpperCase() + '.';
        }
      }
      let typeId = await this.lookup.gender(fieldName, {
        firstName: data.firstName,
        title: data.title,
        subName: data.subName,
        type: data.type
      }, data.typeId ? data.typeId : 105, data);
      if (typeId) {
        data.typeId = typeId;
      }
      if (data.functionId === undefined) {
        if (data.function) {
          data.functionId = await this.lookup.contactFunction(fieldName, {function: data.function}, DEFAULT_FUNCTION, data);
        } else {
          data.functionId = DEFAULT_FUNCTION
        }
      }
      if (data.salutationId === undefined) {
        if (data.salutation) {
          data.salutationId = await this.lookup.contactSalutation(fieldName, {salutation: data.salutation}, DEFAULT_SALUTATION, data);
        } else {
          data.salutationId = DEFAULT_SALUTATION;
        }
      }

      this.copyFieldsToResult(result, data, ['fullName', 'function', 'salutation']);
      let later = result.middleName && result.middleName.length ? (result.firstName + ' ' + result.middleName) : result.firstName && result.firstName.length ? result.firstName : result.firstLetters;
      if (result.namePrefix) {
        later += ' ' + result.namePrefix;
      }
      if (later) {
        result.fullName = result.name + ', ' + later;
      } else {
        result.fullName = result.name;
      }

    }

    let currentFields = this.remapFields(result);
    return super.processKeys(fieldName, currentFields, result, logger);
  }
}

module.exports.FieldContact = FieldContact;
module.exports.DEFAULT_FUNCTION = DEFAULT_FUNCTION;
module.exports.DEFAULT_SALUTATION = DEFAULT_SALUTATION;
module.exports.DEFAULT_ORGANISATION = DEFAULT_ORGANISATION;
