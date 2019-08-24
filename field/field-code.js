/*
 *
 */

const FieldComposed = require('./field-composed').FieldComposed;
const FieldText = require('./field-text').FieldText;
const FieldGuid = require('./field-text').FieldGuid;

class FieldCode extends FieldComposed {
  constructor(options = {}) {
    super(options);
    this._fields.code = new FieldText();
    this._fields.codeId = new FieldGuid();
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
      if (fields.codeId) {
        data.value = await this._fields.codeId.convert(fieldName, data.codeId, logger)
      } else if (fields.code) {
        data.value = await this._fields.code.convert(fieldName, data.code, logger)
      }
    }
    return Promise.resolve(this.copyFieldsToResult(result, data, ['code']))
  }
}

module.exports.FieldCode = FieldCode;