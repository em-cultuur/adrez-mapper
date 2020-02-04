/**
 * Field Compose like email, telephone, url and location etc
 * Stored in the Location table
 *
 */

const FieldText = require('./field-text').FieldText;
// const FieldGuid = require('./field-text').FieldTextGuid;
const FieldObject = require('./field-object').FieldObject;
const FieldBoolean = require('./field-text-boolean').FieldTextBoolean;



class FieldComposed extends FieldObject {

  constructor(options = {}) {
    super(options);

    this._fields.value =  options.valueType ? options.valueType : new FieldText();
    this._fields.isDefault = new FieldBoolean();
      // _type: new FieldText({emptyAllow: true}),
      // _source: new FieldText({emptyAllow: true}),      // textual version of the sourceId. Overrulde if _sourceId is set
      // _sourceId: new FieldText({emptyAllow: true}),    // the codeId to sync with. if not storage space, places in typeId


    // this._lookup = options.lookup;
  }

  /**
   * must translate type into typeId
   *
   * @param fieldName
   * @param fields the field parsers
   * @param data the data given
   * @param logger Class where to store the errors
   */
  // async processKeys(fieldName, fields, data, logger) {
  //   if (data.value !== undefined && ! (fields['typeId'] && ! fields['typeId'].isEmpty(data['typeId']))) {
  //     if (this.lookup && this.lookupFunctionName && this.lookup[this.lookupFunctionName]) {
  //       data.typeId = await this.lookup[this.lookupFunctionName](fieldName, data.type, this.baseTypeId, data);
  //     } else if (data.type !== undefined) {
  //       this.log(logger, 'error', fieldName, `no lookup function or lookupFunction name not defined for class "${this.constructor.name}" to translate type to typeId`);
  //     } else {
  //       data.typeId = this.baseTypeId;
  //     }
  //   }
  //   delete data.type;
  //   let cFields = this.remapFields(data);
  //   return super.processKeys(fieldName, cFields, data, logger);
  // }
}

module.exports.FieldComposed = FieldComposed;

