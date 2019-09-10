/*
 * code.
 * to add a code: use code='the test' or codeId=1234
 * to remove a code use code='the test' _remove=true
 */

// const FieldComposed = require('./field-composed').FieldComposed;
const FieldObject = require('./field-object').FieldObject;
const FieldText = require('./field-text').FieldText;
const FieldGuid = require('./field-text').FieldGuid;
const FieldBoolean = require('./field-text-boolean').FieldTextBoolean;

class FieldCode extends FieldObject {
  constructor(options = {}) {
    super(options);
    this._fields.code = new FieldText();
    this._fields.codeId = new FieldGuid();
    this._fields._remove = new FieldBoolean();                     // set to true to remove it
    this._fields._source = new FieldText({emptyAllow: true});      // textual version of the sourceId. Overrulde if _sourceId is set
    this._fields._sourceId = new FieldText({emptyAllow: true});    // the codeId to sync with. if not storage space, places in typeId
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

    if (fields.codeId) {
      data.codeId = await this._fields.codeId.convert(fieldName, data.codeId, logger)
    } else if (fields.code) {
      data.codeId = await this.lookup.code(fieldName, data.code, 0, data);
    } else {
      this.log(logger, 'warn', fieldName, 'no code or codeId. record skipped')
    }
    if (data._remove) {
      result._remove = 1;
    }

    this.copyFieldsToResult(result, data, ['code']);
    // recalculate the available fields
    let cFields = this.remapFields(result);
    return super.processKeys(fieldName, cFields, result, logger);
  }
}

module.exports.FieldCode = FieldCode;