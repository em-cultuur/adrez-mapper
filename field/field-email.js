/*
 *
 */

const FieldComposed = require('./field-composed').FieldComposed;
const FieldTextEmail = require('./field-text-email').FieldTextEmail;

let CODE_EMAIL = 115;

class FieldEmail extends FieldComposed {
  constructor(options = {}) {
    super(options);
    if (options.CODE_EMAIL) {
      CODE_EMAIL = options.CODE_EMAIL;
    }
    this._fields.email = new FieldTextEmail();
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

    if (fields.value === undefined) {  // value overrules all
      if (fields.email) {
        data.value = await this._fields.email.convert(fieldName, data.email, logger)
        if (data.value && data.typeId === undefined && this.lookup) {
          data.typeId = await this.lookup.email(fieldName, data.type, CODE_EMAIL, data);
        }
      }
    }
    if (data.typeId === undefined) {
      data.typeId = CODE_EMAIL;
    }
    this.copyFieldsToResult(result, data, ['email']);
    let cFields = this.remapFields(result);
    return super.processKeys(fieldName, cFields, result, logger);
  }
}

module.exports.FieldEmail = FieldEmail;
