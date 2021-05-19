/*
 *
 */

const FieldComposed = require('./field-composed').FieldComposed;
const FieldTextEmail = require('./field-text-email').FieldTextEmail;

class FieldEmail extends FieldComposed {
  constructor(options = {}) {
    super(options);
    this.lookupFunctionName = 'email';
    this.baseTypeId = options.baseTypeId !== undefined ? options.baseTypeId : 115;

    this._fields.email = new FieldTextEmail({emptyAllow: false});
    this._fields.newsletter = new FieldTextEmail({ emptyAllow: false});
    this._fields.prive = new FieldTextEmail({ emptyAllow: false});
    this.addStoreGroup('value')
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
      } else if (fields.newsletter) {
        data.value = await this._fields.newsletter.convert(fieldName, data.newsletter, logger);
        data.type = 'Nieuwsbrief'
      } else if (fields.prive) {
        data.value = await this._fields.prive.convert(fieldName, data.prive, logger);
        data.type = 'Privé'
      }
    }
    if (!data.value) {
      return {}
    }
    this.copyFieldsToResult(result, data, ['email', 'newsletter', 'prive']);
    let cFields = this.remapFields(result);
    return super.processKeys(fieldName, cFields, result, logger);
  }
}

module.exports.FieldEmail = FieldEmail;
