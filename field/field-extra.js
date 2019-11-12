
// const FieldCode = require('./field-code').FieldCode;
const FieldGuid = require('./field-text').FieldTextGuid;
const FieldComposed = require('./field-composed').FieldComposed;
const FieldText = require('./field-text').FieldText;
const FieldBoolean = require('./field-text-boolean').FieldTextBoolean;
const FieldNumber = require('./field-text-number').FieldTextNumber;
const FieldDate = require('./field-text-date').FieldTextDate;

/** FIX VALUE DEFINDED IN ADREZ */
const CODE_TYPE_EXTRA = 11;

class FieldExtra extends FieldComposed {
  constructor(options) {
    super(options);
    this._fields.text = new FieldText();
    this._fields.boolean = new FieldBoolean();
    this._fields.description = new FieldText();
    this._fields.number = new FieldNumber();
    this._fields.groupId = new FieldGuid();
    this._fields.date = new FieldDate();
    this._fields.dateTime = new FieldDate();
    this._fields.money = new FieldText();
    // ToDo create some component for these types
    this._fields.list = new FieldText();
    this._fields.multi = new FieldText();
    this._fields.image = new FieldText();
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
      result._type = 'string';
    } else if (fields.number) {
      result.text = await this._fields.number.convert(fieldName, data.number, logger);
      result._type = 'integer';
    } else if (fields.date) {
      result.text = await this._fields.date.convert(fieldName, data.date, logger);
      result._type = 'date';
    } else if (fields.dateTime) {
      result.text = await this._fields.dateTime.convert(fieldName, data.dateTime, logger);
      result._type = 'dateTime';
    } else if (fields.money) {
      result.text = await this._fields.money.convert(fieldName, data.money, logger);
      result._type = 'money';
    } else if (fields.list) {
      result.text = await this._fields.list.convert(fieldName, data.list, logger);
      result._type = 'list';
    } else if (fields.image) {
      result.text = await this._fields.image.convert(fieldName, data.image, logger);
      result._type = 'image';
    } else if (fields.multi) {
      result.text = await this._fields.multi.convert(fieldName, data.multi, logger);
      result._type = 'multi';
    } else {
      this.log(logger, 'warn',fieldName, 'no data found')
    }
    if (data.groupId === undefined) {
      result.groupId = CODE_TYPE_EXTRA;
    } else {
      result.groupId = data.groupId;
    }
    this.copyFieldsToResult(result, data, ['boolean']);
    let cFields = this.remapFields(result);
    return super.processKeys(fieldName, cFields, result, logger);
  }
}

module.exports.FieldExtra = FieldExtra;
module.exports.FIELD_GROUP_TYPE_EXTRA = CODE_TYPE_EXTRA;
