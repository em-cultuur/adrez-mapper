/**
 * Field Compose like email, telephone etc
 */

const FieldText = require('./field-text').FieldText;
const FieldGuid = require('./field-text').FieldTextGuid;
const FieldObject = require('./field-object').FieldObject;
const FieldBoolean = require('./field-text-boolean').FieldTextBoolean;

const TYPE_UNKNOWN = 999999;

class FieldComposed extends FieldObject {

  constructor(options = {}) {
    super(options);
    // this should be set by the child object. Defines the parentId for new records
    this.baseTypeId = undefined;
    // this function is called when type has to be translated to typdId
    this.lookupFunctionName = false;

    this._fields = {
      type: new FieldText({emptyAllow: true}),        // the name of the code
      typeId: new FieldGuid({emptyAllow: true}),      // the id, overrules the type
      value: options.valueType ? options.valueType : new FieldText(),  // the field to store
      isDefault: new FieldBoolean(),
      _type: new FieldText({emptyAllow: true}),
      _source: new FieldText({emptyAllow: true}),      // textual version of the sourceId. Overrulde if _sourceId is set
      _sourceId: new FieldText({emptyAllow: true}),    // the codeId to sync with. if not storage space, places in typeId
      _parent: new FieldText({emptyAllow: true}),      // where is this record linked to
    };
    // this._lookup = options.lookup;
  }

  /**
   * retrieve the base type from a string
   *   name: rec.email[0]  => email
   *         rec.location[3] => location
   * @param name
   * @private
   */
  _baseType(name) {
    let index = name.indexOf('[');
    if (index > -1) {
      let start = name.indexOf('.') + 1;
      return name.substr(start, index - start)
    } else {
      return name;
    }
  }
  /**
   * must translate type into typeId
   *
   * @param fieldName
   * @param fields the field parsers
   * @param data the data given
   * @param logger Class where to store the errors
   */
  async processKeys(fieldName, fields, data, logger) {
    if (data.value !== undefined && ! (fields['typeId'] && ! fields['typeId'].isEmpty(data['typeId']))) {
      if (this.lookup && this.lookupFunctionName && this.lookup[this.lookupFunctionName]) {
        data.typeId = await this.lookup[this.lookupFunctionName](fieldName, data.type, this.baseTypeId, data);
      } else if (data.type !== undefined) {
        this.log(logger, 'error', fieldName, `no lookup function or lookupFunction name not defined for class "${this.constructor.name}" to translate type to typeId`);
      } else {
        data.typeId = this.baseTypeId;
      }
    }
    delete data.type;
    let cFields = this.remapFields(data);
    return super.processKeys(fieldName, cFields, data, logger);
  }
}

module.exports.FieldComposed = FieldComposed;
module.exports.TYPE_UNKNOWN = TYPE_UNKNOWN;
