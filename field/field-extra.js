
const FieldCode = require('./field-code').FieldCode;
const FieldComposed = require('./field-composed').FieldComposed;
const FieldText = require('./field-text').FieldText;
const FieldBoolean = require('./field-text-boolean').FieldTextBoolean;

class FieldExtra extends FieldComposed {
  constructor(options) {
    super(options);
    this._fields.text = new FieldText();
    this._fields.boolean = new FieldBoolean();
    this._fields.description = new FieldText();
  }

  /**
   * read only the field that are filled
   * @param fieldName
   * @param fields
   * @param data
   * @param logger
   * @returns {Promise<void>}
   */
  async processKeys(fieldName, fields, data, logger) {
    let result = {};
    if (fields.boolean) {
      result.text = this._fields.boolean.validate(fieldName, data.boolean, logger) ? '0' : '1';
    } else if (field.text) {
      result.text = this._fields.text.validate(fieldName, data.text, logger);
    } else if (field.description) {
      result.description = this._fields.description.validate(fieldName, data.description, logger);
    } else {
      this.log(logger, 'warn',fieldName, 'no data found')
    }

    this.copyFieldsToResult(result, data, ['boolean']);
    let cFields = this.remapFields(result);
    return super.processKeys(fieldName, cFields, result, logger);

  }
}

module.exports.FieldExtra = FieldExtra;