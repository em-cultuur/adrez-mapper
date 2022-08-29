/**
 * field-contact
 */

/**
 * Field Compose like email, telephone etc
 */

const FieldText = require('./field-text').FieldText;
const FieldGuid = require('./field-text').FieldTextGuid;
const FieldBoolean = require('./field-text-boolean').FieldTextBoolean;
const FieldLocatorContact = require('./field-locator-contact').FieldLocatorContact;
// const FieldObject = require('./field-object').FieldObject;
const FieldComposed = require('./field-composed').FieldComposed;
const NameParse = require('../lib/name-parser').ParseFullName;
const _ = require('lodash');

const DEFAULT_FUNCTION = 0;
const DEFAULT_SALUTATION = 890;
const DEFAULT_ORGANISATION = 101;

const MODE_FORCE = 128;

class FieldContact extends FieldComposed {

  constructor(options = {}) {
    super(options);
    this._fields = _.merge(this._fields, {
      // fields for the database
      guid: new FieldGuid(),
      firstName: new FieldText(),      // the id, overrules the type
      middleName: new FieldText(),
      title: new FieldText(),
      firstLetters : new FieldText(),
      nickName: new FieldText(),
      namePrefix: new FieldText(),
      name: new FieldText(),
      nameSuffix: new FieldText(),

      functionId: new FieldGuid(),
      functionGuid: new FieldGuid(),
      function: new FieldText(),
      salutationId: new FieldGuid(),
      salutationGuid: new FieldGuid(),
      salutation: new FieldText(),
   //   isDefault: new FieldBoolean(),

      search: new FieldText(),

      isOrganisation: new FieldBoolean(),
      organisation: new FieldText(),
      subName: new FieldText(),  // department etc
      // key should an other contacts key
      _key: new FieldText(),
      useParentLocation: new FieldBoolean(),
      // _parent is defined in the object type
      // if _key is defined the contactId is automatic set
      contactId: new FieldGuid(),
      _campaign: new FieldText(),

      // used to for calculations
      fullName: new FieldText(),
      // for alphabetical names
      sortName: new FieldText(),

      _source: new FieldText(),      // the ref to only update our own info
      locator: new FieldLocatorContact()
    });
    // the contact does not know about values
    delete this._fields.value;
    this._parser = new NameParse();
    this.addStoreGroup('name');
    this.addStoreGroup('organisation')
  }

  mustStoredRecord(data) {
    if (!super.mustStoredRecord(data)) {
      if (data['_mode'] && (data['_mode'] & MODE_FORCE)) {
        return true
      }
      return false
    }
    return true;
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
    let result = {
      subName: data.subName,
      _key: data._key,
      _parent: data._parent,
      _source: data._source,
      _mode: data._mode,

    };

    if (data.isOrganisation || (data.organisation && data.organisation.length > 0)) {
      if (data.organisation) {
        result.name = data.organisation.trim();
      } else if (data.fullName) {
        result.name = data.fullName.trim();
      } else {
        result.name = data.name.trim();
      }
      if (!data.hasOwnProperty('typeId')) {
        result.typeId = await this.lookup.contact(fieldName, {type: data.type}, DEFAULT_ORGANISATION, data)
      } else {
        result.typeId = data.typeId;
      }
      result.fullName = result.name;
    } else {
      if (fields.sortName && ! (fields.fullName || fields.name)) {
        let p = data.sortName.indexOf(',');
        if (p) {
          data.fullName = data.sortName.substr(p + 1).trim() + ' ' + data.sortName.substr(0, p);
        } else {
          data.fullName = data.sortName;
        }
        // trick system into that we have the fields
        fields.fullName = fields.sortName;
      }
      if (fields.fullName && fields.name === undefined) {
        // parse the fullname only if there isn't already a name
        let parsed = this._parser.analyse(data.fullName.trim());
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
            data[mapping[field]] = parsed[field].trim();
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
      if (data.typeId) {
        result.typeId = data.typeId
      } else {
        if (data.typeGuid === false
          || data.hasOwnProperty('firstName')
          || data.hasOwnProperty('title')
          || data.hasOwnProperty('type')
          || data.hasOwnProperty('typeGuid')
        )
        result.typeId = await this.lookup.gender(fieldName, {
          firstName: data.firstName,
          title: data.title,
          // subName: data.subName,
          type: data.type,
          typeGuid: data.typeGuid
        }, data);
      }
      // should not set field, if they are not send from the api. Webhook updates only partial fields
      let codeDef;
      if (data.hasOwnProperty('functionId') || data.hasOwnProperty('functionGuid') || data.hasOwnProperty('function')) {
        codeDef = {
          // the code we want to find. Text is store in the result.type
          // if functionId is set to false the default is used
          id: data.functionId,
          guid: data.functionGuid === false ? undefined : data.functionGuid,
          text: data.function,
          parentIdDefault: DEFAULT_FUNCTION
        };
        data.functionId = await this.lookup.contactFunction(fieldName, codeDef);
      }
      if (data.hasOwnProperty('salutationId') || data.hasOwnProperty('salutationGuid') || data.hasOwnProperty('salutation')) {
        codeDef = {
          // the code we want to find. Text is store in the result.type
          id: data.salutationId,
          guid: data.salutationGuid === false ? undefined : data.salutationGuid,
          text: data.salutation,
          parentIdDefault: DEFAULT_SALUTATION
        };
        data.salutationId = await this.lookup.contactSalutation(fieldName, codeDef);
      }
      this.copyFieldsToResult(result, data, ['fullName', 'function', 'salutation']);

      // remove any trace of the prefix if we are changing the name
      if (!result.hasOwnProperty('namePrefix') && result.name) {
        result.namePrefix = ''
      }
    }

    if (data.locator) {
      if (fields.locator) {
        result.locator = await fields.locator.convert(fieldName + '.locator', data.locator, logger);
        if (Object.keys(result.locator).length === 0) {
          delete result.locator
        }
      } else {
        // locator was removed because no valid field
        this.log(logger, 'error', `locator ${fieldName}.locator is empty`);
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
