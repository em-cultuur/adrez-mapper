/**
 * Field text. Does not do any conversion
 */

const Field = require('./field').Field;

class FieldText extends Field {
  constructor(options = {}){
    super(options);
    this._name = 'text';
  }

  isEmpty(data) {
    if (data === undefined) return true;
    if (typeof data === 'string' && data.trim().length === 0) return true;
    // 0 / false is NOT empty
    return false;
  }

  /**
   * validate a fields properties (keys)
   * it ONLY checkes that the structure of data can be handled by this routine
   *
   * @param fieldName String,
   * @param data Object|String|Or what ever is given
   * @param logger Class logger class. if available the info is logged to this object
   * @return {boolean} True: it can be handled, False: structure has an error
   */
  validate(fieldName, data, logger = false) {
    if (data !== undefined && !(typeof data === 'string' || typeof data === 'number')) {
      this.log(logger,'error', fieldName, `must be string or number ${typeof data}`);
      return false;
    } else {
      return true;
    }
  }
}

class FieldGuid extends FieldText {

  _isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  async convert(fieldName, data, logger) {
    let r = await super.convert(fieldName, data, logger);
    if (this._isNumeric(r)) { // we could get "0" which is true
        r = parseInt(r,10)
    }
    return r;
  }
}
module.exports.FieldText = FieldText;
module.exports.FieldTextGuid = FieldGuid;
