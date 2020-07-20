

const FieldGuid = require('./field-text').FieldTextGuid;
const FieldObject = require('./field-object').FieldObject;
const FieldText = require('./field-text').FieldText;
const FieldBoolean = require('./field-text-boolean').FieldTextBoolean;
const FieldNumber = require('./field-text-number').FieldTextNumber;
const FieldDate = require('./field-text-date').FieldTextDate;

class FieldExtra extends FieldObject {
  constructor(options) {
    super(options);
    this.emptyValueAllowed = true;
    this.lookupFunctionName = 'extra';
    // 201 is wrong value but there is no default extra field.
    this.baseTypeId = options.baseTypeId !== undefined ? options.baseTypeId : 201;
    this._fields.useDescription = new FieldBoolean({emptyAllow: true, returnNumeric: true})

    this._controlTypes = {
      boolean: new FieldBoolean({ emptyAllow: false}),
      text: new FieldText({ emptyAllow: false}),
      number: new FieldNumber({ emptyAllow: false}),
      date: new FieldDate({ emptyAllow: false}),
    };
    this._fieldDef = {
      text: {
        fieldName: 'text',
        fieldTypeGuid: 'ADREZ_FIELD_STRING',
        fieldTypeId: 201,
        field: this._controlTypes.text,
        useDescription: false,
        skip: false  // field should remain in the result
      },
      description: {
        fieldName: 'description',
        fieldTypeGuid: 'ADREZ_FIELD_MEMO',
        fieldTypeId: 206,
        field: this._controlTypes.text,
        useDescription: true,
        skip: false  // field should remain in the result
      },
      boolean: {
        fieldName: 'text',
        fieldTypeGuid: 'ADREZ_FIELD_BOOLEAN',
        fieldTypeId: 202,
        field: this._controlTypes.boolean,
        useDescription: false,
      },
      number: {
        fieldName: 'text',
        fieldTypeGuid: 'ADREZ_FIELD_INTEGER',
        fieldTypeId: 203,
        field: this._controlTypes.number,
        useDescription: false,
      },
      date: {
        fieldName: 'text',
        fieldTypeGuid: 'ADREZ_FIELD_DATE',
        fieldTypeId: 204,
        field: this._controlTypes.date,
        useDescription: false,
      },
      dateTime: {
        fieldName: 'text',
        fieldTypeGuid: 'ADREZ_FIELD_DATETIME',
        fieldTypeId: 205,
        field: this._controlTypes.date,
        useDescription: false,
      },
      money: {
        fieldName: 'text',
        fieldTypeGuid: 'ADREZ_FIELD_MONEY',
        fieldTypeId: 207,
        field: this._controlTypes.text,
        useDescription: false,
      },
      list: {
        fieldName: 'description',
        fieldTypeGuid: 'ADREZ_FIELD_LIST',
        fieldTypeId: 208,
        field: this._controlTypes.text,
        useDescription: false,
      },
      image: {
        fieldName: 'text',
        fieldTypeGuid: 'ADREZ_FIELD_IMAGE',
        fieldTypeId: 209,
        field: this._controlTypes.text,
        useDescription: false,
      },
      multi: {
        fieldName: 'description',
        fieldTypeGuid: 'ADREZ_FIELD_MULTI',
        fieldTypeId: 210,
        field: this._controlTypes.text,
        useDescription: false,
      },
    };
    this._skipFields = [];
    for (let name in this._fieldDef) {
      if (!this._fieldDef.hasOwnProperty(name)) { continue }
      this._fields[name] = this._fieldDef[name].field;
      if (this._fieldDef[name].skip === undefined || this._fieldDef[name].skip) {
        this._skipFields.push(name);
      }
    }
  }

  buildCodeDef(definition, data) {
    if (data.useDescription) {
      definition.useDescription = data.useDescription;
    }
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
    // find the first occurence of an type
    for (let name in this._fieldDef) {
      if (!this._fieldDef.hasOwnProperty(name)) {
        continue
      }
      if (fields[name] && data[name] !== undefined) {
        // found the field
        result[this._fieldDef[name].fieldName] = await this._fields[name].convert(fieldName, data[name], logger);
        if (this._fieldDef[name].field === this._controlTypes.boolean) {
          // booleans must be converted to Text
          result[this._fieldDef[name].fieldName] = result[this._fieldDef[name].fieldName] ? '1' : '0'
        }
        result.fieldTypeGuid = this._fieldDef[name].fieldTypeGuid;
        result.fieldTypeId = this._fieldDef[name].fieldTypeId;
        result.useDescription = data.useDescription !== undefined ? data.useDescription : this._fieldDef[name].useDescription;
        break;
      }
    }
    if (Object.keys(result).length === 0) {
      return {};
    }

    this.copyFieldsToResult(result, data, this._skipFields);
    let cFields = this.remapFields(result);

    let aws = await super.processKeys(fieldName, cFields, result, logger); // .then( (aws) => {
    this.copyFieldsToResult(result, aws, ['fieldTypeGuid', 'fieldTypeId'])
    return result
  }
}

module.exports.FieldExtra = FieldExtra;
