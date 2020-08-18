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

class FieldContact extends FieldComposed {

  constructor(options = {}) {
    super(options);
    this._fields = _.merge(this._fields, {
      // fields for the database
      guid: new FieldGuid({ emptyAllow: false}),
      firstName: new FieldText({ emptyAllow: false}),      // the id, overrules the type
      middleName: new FieldText({ emptyAllow: false}),
      title: new FieldText(),
      firstLetters : new FieldText(),
      nickName: new FieldText(),
      namePrefix: new FieldText(),
      name: new FieldText({ emptyAllow: false}),
      nameSuffix: new FieldText(),

      functionId: new FieldGuid(),
      functionGuid: new FieldGuid(),
      function: new FieldText(),
      salutationId: new FieldGuid(),
      salutationGuid: new FieldGuid(),
      salutation: new FieldText(),
   //   isDefault: new FieldBoolean(),

      search: new FieldText(),

      isOrganisation: new FieldBoolean({emptyAllow: true}),
      organisation: new FieldText({ emptyAllow: false}),
      subName: new FieldText(),  // department etc
//      organizationId: new FieldGuid({emptyAllow: true}),
      // key should an other contacts key
      _key: new FieldText({emptyAllow: true}),
      // _parent is defined in the object type
      // if _key is defined the contactId is automatic set
      contactId: new FieldGuid({emptyAllow: true}),
      _campaign: new FieldText({emptyAllow: true}),

      // used to for calculations
      fullName: new FieldText({ emptyAllow: false}),

  //    _source: new FieldText({emptyAllow: true}),      // the ref to only update our own info
      locator: new FieldLocatorContact({emptyAllow: true})
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
    let result = {
      subName: data.subName,
      _key: data._key,
      _source: data._source,
      _mode: data._mode,
    };

    if (data.isOrganisation || (data.organisation && data.organisation.length > 0)) {
      if (data.organisation) {
        result.name = data.organisation;
      } else if (data.fullName) {
        result.name = data.fullName;
      } else {
        result.name = data.name;
      }
      if (!data.hasOwnProperty('typeId')) {
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
      if (data.typeId) {
        result.typeId = data.typeId
      } else {
        result.typeId = await this.lookup.gender(fieldName, {
          firstName: data.firstName,
          title: data.title,
          // subName: data.subName,
          type: data.type,
          typeGuid: data.typeGuid
        }, data.typeId ? data.typeId : 105, data);
      }
      // version 0.5.2: use the same structure as for the type translation
      let codeDef = {
        // the code we want to find. Text is store in the result.type
        id: data.functionId,
        guid: data.functionGuid,
        text: data.function,
        parentIdDefault: DEFAULT_FUNCTION
      };
      data.functionId = await this.lookup.contactFunction(fieldName, codeDef);
      codeDef = {
        // the code we want to find. Text is store in the result.type
        id: data.salutationId,
        guid: data.salutationGuid,
        text: data.salutation,
        parentIdDefault: DEFAULT_SALUTATION
      };
      data.salutationId = await this.lookup.contactSalutation(fieldName, codeDef);

      this.copyFieldsToResult(result, data, ['fullName', 'function', 'salutation']);
      // ------>> this does not work with a partial update. If name is undefined it results in 'undefined, Jay'
      // let later = result.middleName && result.middleName.length ? (result.firstName + ' ' + result.middleName) : result.firstName && result.firstName.length ? result.firstName : result.firstLetters;
      // if (result.namePrefix) {
      //   later += ' ' + result.namePrefix;
      // }
      // if (later) {
      //   result.fullName = result.name + ', ' + later;
      // } else {
      //   result.fullName = result.name;
      // }
    }

    if (data.locator) {
      if (fields.locator) {
        result.locator = await fields.locator.convert(fieldName + '.locator', data.locator, logger);
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
