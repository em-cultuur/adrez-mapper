/*
 *
 */

const FieldComposed = require('./field-composed').FieldComposed;
const FieldTextUrl = require('./field-text-url').FieldTextUrl;

class FieldUrl extends FieldComposed {
  constructor(options = {}) {
    super(options);
    this._fields.url = new FieldTextUrl({part: 'hostname'});
    this._fields.href = new FieldTextUrl({part: 'href'});
    this._fields.hostPath = new FieldTextUrl({part: 'hostPath'});
    this._fields.origin = new FieldTextUrl({part: 'origin'});
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

    if (fields.value === undefined) {  // value overrules all
      if (fields.url) {
        data.value = await this._fields.url.convert(fieldName, data.url, logger)
      } else if (fields.href) {
        data.value = await this._fields.href.convert(fieldName, data.href, logger)
      } else if (fields.hostPath) {
        data.value = await this._fields.hostPath.convert(fieldName, data.hostPath, logger)
      } else if (fields.origin) {
        data.value = await this._fields.origin.convert(fieldName, data.origin, logger)
      }
    }
    this.copyFieldsToResult(result, data, ['url', 'href', 'hostPath', 'origin']);
    let cFields = this.remapFields(result);
    return super.processKeys(fieldName, cFields, result, logger);
  }
}

module.exports.FieldUrl = FieldUrl;
