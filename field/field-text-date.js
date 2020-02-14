/**
 * Field number. Does not do any conversion
 */

const Field = require('./field').Field;

class FieldTextDate extends Field {
  constructor(options = {}){
    super(options);
    this._name = 'date';
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
      this.log(logger,'error', fieldName, `must be string or number (${typeof data})`);
      return false;
    } else {
      return true;
    }
  }
}
module.exports.FieldTextDate = FieldTextDate;
