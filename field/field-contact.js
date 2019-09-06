/**
 * field-contact
 */

/**
 * Field Compose like email, telephone etc
 */

const FieldText = require('./field-text').FieldText;
const FieldGuid = require('./field-text').FieldGuid;

// const FieldObject = require('./field-object').FieldObject;
const FieldComposed = require('./field-composed').FieldComposed;
const NameParse = require('../lib/name-parser').ParseFullName;
const _ = require('lodash');

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

      search: new FieldText(),

      // used to for calculations
      fullName: new FieldText(),
      organization: new FieldText({emptyAllow: true}),
      organizationId: new FieldGuid({emptyAllow: true}),

      _source: new FieldText({emptyAllow: true}),      // the ref to only update our own info
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
    if (fields.fullName && fields.name === undefined) {
      // parse the fullname only if there isn't already a name
      let parsed = this._parser.analyse(data.fullName);
      if (parsed.error.length) {
        this.log(logger, 'warn', fieldName + 'fullName', parsed.error.join(', ') );
      }
      const mapping = {
        last : 'name',
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
    let typeId = await this.lookup.gender(fieldName, {firstName: data.firstName, title: data.title, subName: data.subName, type: data.type}, data.typeId ? data.typeId : 105, data);
    if (typeId) {
      data.typeId = typeId;
    }
    this.copyFieldsToResult(result, data, ['fullName']);
    // the fields have be changed / remove / added. So rebuild
    // let currentFields = {};
    // for (let key in result) {
    //   if (!result.hasOwnProperty(key)) { continue }
    //   currentFields[key] = this._fields[key];
    // }
    let currentFields = this.remapFields(result);
    return super.processKeys(fieldName, currentFields, result, logger);
  }
}

module.exports.FieldContact = FieldContact;