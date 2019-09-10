
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
      result.text = await this._fields.boolean.convert(fieldName, data.boolean, logger) ? '1' : '0';
      result._type = 'boolean';
    } else if (fields.description) {
      result.description = await this._fields.description.convert(fieldName, data.description, logger);
      result._type = 'memo';
    } else if (fields.text) {
      result.text = await this._fields.text.convert(fieldName, data.text, logger);
      result._type = 'text';
    } else {
      this.log(logger, 'warn',fieldName, 'no data found')
    }

    this.copyFieldsToResult(result, data, ['boolean']);
    let cFields = this.remapFields(result);
    return super.processKeys(fieldName, cFields, result, logger);

  }
}

module.exports.FieldExtra = FieldExtra;