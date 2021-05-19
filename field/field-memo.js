/*
 *
 */

const FieldComposed = require('./field-composed').FieldComposed;
const FieldText = require('./field-text').FieldText;
const FieldTextBoolean = require('./field-text-boolean').FieldTextBoolean;

class FieldMemo extends FieldComposed {
  constructor(options = {}) {
    super(options);
    this.lookupFunctionName = 'memo';

    this.baseTypeId = options.baseTypeId !== undefined ? options.baseTypeId : 0;

    // if field is set, save it all
    this._fields.text = this._fields.value;
    this._fields.description = new FieldText();
    // this is stored in the Code definition
    this._fields.useDescription = new FieldTextBoolean({returnNumeric: true})
    this.addStoreGroup('text');
    this.addStoreGroup('description')
  }

  buildCodeDef(definition, data) {
    if (data.useDescription) {
      definition.useDescription = data.useDescription;
    }
  }

  async processKeys(fieldName, fields, data, logger) {
    if (fields.useDescription) { // we force the type of memo
      data.useDescription = await fields.useDescription.convert(fieldName, data.useDescription, logger);
      if (data.useDescription && fields.description) {
        data.description = await fields.description.convert(fieldName, data.description, logger);
        delete data.text;
      } else if (!data.useDescription && fields.text) {
        data.value = await fields.text.convert(fieldName, data.text, logger);
        delete data.description;
      } else {
        delete data.description;
        delete data.text;
        delete data.useDescription;
      }
    } else if (fields.description) {
      data.description = await fields.description.convert(fieldName, data.description, logger);
      data.useDescription = true;
      delete data.text;
    } else if (fields.text) {
      data.value = await fields.text.convert(fieldName, data.text, logger);
      data.useDescription = false;
      delete data.description;
    } else {
      // never called because field-object blocks empty records!
      delete data.description;
    }

    // we must force the type of the memo
    if (data.type === undefined && data.typeId === undefined) {
      data.type = ''
    }
    let cFields = this.remapFields(data);
    return super.processKeys(fieldName, cFields, data, logger);
  }
}

module.exports.FieldMemo = FieldMemo;
