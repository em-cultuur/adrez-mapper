/**
 * Field text. Does not do any conversion
 */

const Field = require('./field').Field;

class FieldText extends Field {
  /**
   *
   * @param options
   *  - validValues an array of values the are allowed. if one it act as a boolean (value, undefined( field
   *  - isCaseInsensitive - false - if true no case is used
   */
  constructor(options = {}){
    super(options);
    this._name = 'text';
    if (options.hasOwnProperty('validValues')) {
      this.validValues = Array.isArray(options.validValues) ? options.validValues : [options.validValues];
    } else {
      this.validValues = [];
    }
    this.isCaseInsensitive = options.hasOwnProperty('isCaseInsensitive') ? options.isCaseInsensitive : false;
    if (this.isCaseInsensitive) {
      this.validValues.forEach( (v, index) => this.validValues[index] = typeof v === 'string' ?  v.toUpperCase() : v)
    }
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
    if (data !== undefined && !(typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean')) {
      this.log(logger,'error', fieldName, `must be string or number ${typeof data}`);
      return false;
    } else {
      return true;
    }
  }
  async convert(fieldName, data, logger) {
    let r = await super.convert(fieldName, data, logger);
    if (this.isCaseInsensitive && r && typeof r === 'string') {
      r = r.toUpperCase();
    }
    if (this.validValues.length && this.validValues.indexOf(r) < 0) {
      if (this.validValues.length > 1) {
        // act as a yes / undefined field
        this.log(logger, 'warn', fieldName, `the value ${r} is not valid. allowed are ${this.validValues.join(', ')}`);
      }
      return undefined
    }
    return data;
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
