/*
 * code.
 * to add a code: use code='the test' or codeId=1234
 * to remove a code use code='the test' _remove=true
 */

// const FieldComposed = require('./field-composed').FieldComposed;
const FieldObject = require('./field-object').FieldObject;
const FieldText = require('./field-text').FieldText;
const FieldGuid = require('./field-text').FieldTextGuid;
const FieldBoolean = require('./field-text-boolean').FieldTextBoolean;


/** FIX VALUE DEFINDED IN ADREZ */
const CODE_GROUP_ID = 10;
class FieldCode extends FieldObject {
  constructor(options = {}) {
    super(options);
    this.lookupFunctionName = 'code';
    this.baseTypeId = 10;
    this.emptyValueAllowed = true; // we do not need the value to check for the code
    // this._fields.code = new FieldText();
    // alias the type and code definition, so we only need to use the type / typeId to solve them
    this._fields.typeId.emptyAllow = false;
    this._fields.type.emptyAllow = false;
    this._fields.code = this._fields.type;
    this._fields.codeId = this._fields.typeId;
    this._fields.guid = new FieldGuid();
    // to manually set the parent of a newly added code
    this._fields.parentCode = new FieldText();       // the text version with groupId = 10
    this._fields.parentCodeId = new FieldGuid();     // the id of the parent. If not found => 10
    this._fields.parentCodeGuid = new FieldGuid();   // the guid of the parent. If not found => 10
//    this._fields.typeId = new FieldGuid();                       // same as code id.
    this._fields._remove = new FieldBoolean();                     // set to true to remove it
    this._fields._source = new FieldText({emptyAllow: true});      // textual version of the sourceId. Overrulde if _sourceId is set
//    this._fields._sourceId = new FieldText({emptyAllow: true});    // the codeId to sync with. if not storage space, places in typeId
    this._fields._parent = new FieldGuid({emptyAllow: true});
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
    if (data.codeId) {
      data.typeId = data.codeId;
    } else if (data.code) {
      data.type = data.code;
    }
    // if (fields.codeId) {
    //   data.typeId = await this._fields.codeId.convert(fieldName, data.codeId, logger)
    // } else if (fields.code) {
    //   data.typeId = this.lookup ? await this.lookup[this.lookupFunc](fieldName, data.code, 0, data) : 0;
    // } else if (fields.typeId) {
    //   data.typeId = await this._fields.codeId.convert(fieldName, data.typeId, logger)
    // } else  {
    //   this.log(logger, 'warn', fieldName, 'no code or codeId. record skipped')
    // }
    if (data._remove) {
      result._remove = 1;
    }

    this.copyFieldsToResult(result, data, ['code', 'codeId']
     );
    // recalculate the available fields
    let cFields = this.remapFields(result);
    return super.processKeys(fieldName, cFields, result, logger).then((processed) => {
      this.copyFieldsToResult(result, processed, ['parentCodeGuid', 'parentCodeId', 'parentCode'])
      return result;
    });
  }
}

module.exports.FieldCode = FieldCode;
