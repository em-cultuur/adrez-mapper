/*
 *
 */

const FieldComposed = require('./field-composed').FieldComposed;
const FieldTextTelephone = require('./field-text-telephone').FieldTextTelephone;

let CODE_IDS = {
  'telephone' : 113,  // the default one
  'mobile': 114,
  'fax': 116
};
class FieldTelephone extends FieldComposed {
  constructor(options = {}) {
    super(options);
    this.baseTypeId = CODE_IDS['telephone'];
    this.lookupFunctionName = 'telephone';

    this._baseNames = ['telephone', 'mobile', 'fax'];
    this._skipName = [];
    for (let l = 0; l < this._baseNames.length; l++) {
      let name = this._baseNames[l];
      this._fields[name] = new FieldTextTelephone({ emptyAllow: false});
      this._skipName.push(name);
      this._fields[name + 'Int'] = new FieldTextTelephone({countryCode: -1, emptyAllow: false}); // force to international
      this._skipName.push(name + 'Int');
      this._fields[name + '10'] = new FieldTextTelephone({ emptyAllow: false});
      this._skipName.push(name + '10');
      this._fields[name + '10Int'] = new FieldTextTelephone({countryCode: -1, emptyAllow: false}); // force to international
      this._skipName.push(name + '10int');
    }
    this.addStoreGroup('value')
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
    if (!fields.value) {
      for (let l = 0; l < this._baseNames.length; l++) {
        let name = this._baseNames[l];
        if (fields[name + 'Int']) {
          data.value = await this._fields[name + 'Int'].convert(fieldName, '' + data[name + 'Int'], logger)
        } else if (fields[name + '10']) {
          data.value = await this._fields[name + '10'].convert(fieldName, ('' + data[name + '10']).padStart(10, '0'), logger)
        } else if (fields[name + '10Int']) {
          data.value = await this._fields[name + '10Int'].convert(fieldName, ('' + data[name + '10Int']).padStart(10, '0'), logger)
        } else if (fields[name]) {
          data.value = await this._fields[name].convert(fieldName, '' + data[name], logger)
        }
        if (data.value && data.typeId === undefined && data.type === undefined) {
          data.typeId = CODE_IDS[name];
          break; // done it, only one is accepted
        }
      }
    }
    // if (!data.value) {  // empty data skips the record
    //   return {}
    // }
    this.copyFieldsToResult(result, data, this._skipName);
    let cFields = this.remapFields(result);
    return super.processKeys(fieldName, cFields, result, logger);
  }
}

module.exports.FieldTelephone = FieldTelephone;
