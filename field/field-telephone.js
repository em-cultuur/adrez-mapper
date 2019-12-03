/*
 *
 */

const FieldComposed = require('./field-composed').FieldComposed;
const FieldTextTelephone = require('./field-text-telephone').FieldTextTelephone;

class FieldTelephone extends FieldComposed {
  constructor(options = {}) {
    super(options);
    this._fields.telephone = new FieldTextTelephone();
    this._fields.telephoneInt = new FieldTextTelephone({ countryCode: -1})     ; // force to international
    this._fields.telephone10 = new FieldTextTelephone();
    this._fields.telephone10Int = new FieldTextTelephone({ countryCode: -1})     ; // force to international
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
      if (fields.telephoneInt) {
        data.value = await this._fields.telephoneInt.convert(fieldName, '' + data.telephoneInt, logger)
      } else if (fields.telephone10) {
        data.value = await this._fields.telephone10.convert(fieldName, ('' + data.telephone10).padStart(10, '0'), logger)
      } else if (fields.telephone10Int) {
        data.value = await this._fields.telephone10Int.convert(fieldName, ('' + data.telephone10Int).padStart(10, '0'), logger)
      } else if (fields.telephone) {
        data.value = await this._fields.telephone.convert(fieldName, '' + data.telephone, logger)
      }
    }
    this.copyFieldsToResult(result, data, ['telephone', 'telephoneInt']);
    let cFields = this.remapFields(result);
    return super.processKeys(fieldName, cFields, result, logger);
  }
}

module.exports.FieldTelephone = FieldTelephone;
