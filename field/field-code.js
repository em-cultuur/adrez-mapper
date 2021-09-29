/*
 * code.
 * to add a code: use code='the test' or codeId=1234
 * to remove a code use code='the test' _remove=true
 */

const FieldObject = require('./field-object').FieldObject;
const FieldComposed = require('./field-composed').FieldComposed;
const FieldText = require('./field-text').FieldText;
const FieldGuid = require('./field-text').FieldTextGuid;
const FieldBoolean = require('./field-text-boolean').FieldTextBoolean;


/** FIX VALUE DEFINDED IN ADREZ */
const CODE_GROUP_ID = 10;
class FieldCode extends FieldComposed {
  constructor(options = {}) {
    super(options);
    this.lookupFunctionName = 'code';
    this.baseTypeId = 10;
    this.emptyValueAllowed = true; // we do not need the value to check for the code

    // alias the type and code definition, so we only need to use the type / typeId to solve them
    this._fields.code = this._fields.type;
    this._fields.codeId = this._fields.typeId;
    this._fields.codeGuid = this._fields.typeGuid;

    this._fields._remove = new FieldBoolean();                     // set to true to remove it
    this._fields._source = new FieldText();      // textual version of the sourceId. Overrulde if _sourceId is set
    this._fields._parent = new FieldGuid();

    this.addStoreGroup('typeId');
    this.addStoreGroup('type');
    this.addStoreGroup('typeGuid')
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
   //  let result = {};
    // remove the empty fields
    for (let key in data) {
      if (!data.hasOwnProperty(key)) { continue }
      if (this._fields[key] && this._fields[key].isEmpty(data[key])) {
        delete data[key]
      }
    }
    // we internal use only typeXXX definitions
    if (data.codeId) {
      data.typeId = data.codeId;
      delete data.codeId;
    } else if (data.code) {
      data.type = data.code;
      delete data.code
    }
    if (data.codeGuid && !data.typeGuid) {
      data.typeGuid = data.codeGuid;
      delete data.codeGuid
    }

    if (data._remove) {
      data._remove = 1;
    }
    // if (!data.typeId) {
    //   let typeId = await this.lookupCode(data, this.lookupFunctionName, 'type', '', this.baseTypeId, logger)
    //   if (typeId) {
    //     data.typeId = typeId
    //   }
    // }
    // this.copyFieldsToResult(result, data, ['code', 'codeId']);
    // recalculate the available fields
    //let cFields = this.remapFields(result);
    return super.processKeys(fieldName, fields, data, logger)
    // return super.processKeys(fieldName, cFields, result, logger).then((processed) => {
    //   this.copyFieldsToResult(processed, result, ['parentCodeGuid', 'parentCodeId', 'parentCode']);
    //   return processed;
    // });
  }
}

module.exports.FieldCode = FieldCode;
