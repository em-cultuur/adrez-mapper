/**
 * Field Compose like email, telephone etc
 */

const FieldText = require('./field-text').FieldText;
const FieldGuid = require('./field-text').FieldGuid;
const FieldObject = require('./field-object').FieldObject;

const TYPE_UNKNOWN = 999999;

class FieldComposed extends FieldObject {

  constructor(options = {}) {
    super(options);
    this._fields = {
      type: new FieldText(),        // the name of the code
      typeId: new FieldGuid(),      // the id, overrules the type
      value: options.valueType ? options.valueType : new FieldText(),  // the field to store
      _source: new FieldText({emptyAllow: true}),      // textual version of the sourceId. Overrulde if _sourceId is set
      _sourceId: new FieldText({emptyAllow: true}),    // the codeId to sync with. if not storage space, places in typeId
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
      return name.substr(4, index - 4)
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
    if (! (fields['typeId'] && ! fields['typeId'].isEmpty(data['typeId']))) {
      if (this._lookup) {
        data['typeId'] = await this._lookup(data['type'], this._baseType(fieldName), fields, data);
      } else {
        this.log(logger, 'warn', fieldName, `lookup for email, marking unknown`)
        data['typeId'] = TYPE_UNKNOWN;
      }
    } else if (!fields.typeId) {
      this.log(logger, 'warn', fieldName, `no type or typeId set. marking unknown`)
      data['typeId'] = TYPE_UNKNOWN;
    }
    delete data.type;
    let cFields = this.remapFields(data);
    return super.processKeys(fieldName, cFields, data, logger);
  }
}

module.exports.FieldComposed = FieldComposed;
module.exports.TYPE_UNKNOWN = TYPE_UNKNOWN;