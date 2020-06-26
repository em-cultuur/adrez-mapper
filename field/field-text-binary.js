/**
 * Field boolean
 */

const Field = require('./field').Field;

class FieldTextBinary extends Field {
  constructor(options = {}){
    super(options);
    this._name = 'binary';
    this._values = options.hasOwnProperty('values') ? options.values : {
      'yes': 1,
      'ja': 1,
      '1': 1,
      'no': 0,
      'nee': 0,
      '0': 0
    }

  }

  /**
   * validate a fields properties (keys)
   * it ONLY checkes that the structure of data can be handled by this routine
   *
   * @param fieldName String,
   * @param data any value that can be converted into an boolean
   * @param logger Class logger class. if available the info is logged to this object
   * @return {boolean} True: it can be handled, False: structure has an error
   */
  // validate(fieldName, data, logger = false) {
  //   return  (typeof data === 'string' && this._values.hasOwnProperty(data)) ||
  //     (typeof data === 'number');
  // }

  isEmpty(data) {
    return data === undefined
  }


}
module.exports.FieldTextBinary = FieldTextBinary;
