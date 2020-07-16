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


  /*
   * convert the binary (text) data into a numeric value
   *
   */
  async convert(fieldName, data, logger) {
    let dt = [];
    if (Array.isArray(data)) {
      dt = data;
    } else if (typeof data === 'string') {
      dt = data.split(',')
    } else if (typeof data === 'number') {
      return data;
    } else {
      this.log(logger, 'warn', fieldName, `${data} is not a valid binary`)
      return 0;
    }
    dt.forEach(x => x.toLowerCase)
    let n = 0;
    for (let index = 0; index < dt.length; index++) {
      if (dt[index].trim()) {
        if (!this._values.hasOwnProperty(dt[index].trim())) {
          this.log(logger, 'error', `unknown value "${dt[index]}". allowed are: ${Object.keys(this._values).toString()}`)
        } else {
          n += this._values[dt[index].trim()]
        }
      }
    }
    return n;
  }

  isEmpty(data) {
    return data === undefined
  }


}
module.exports.FieldTextBinary = FieldTextBinary;
