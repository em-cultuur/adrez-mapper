/**
 * Field text. Does not do any conversion
 */

const FieldTextZipcode = require('./field-text-zipcode').FieldTextZipcode

class FieldTextZipCity extends FieldTextZipcode {
  constructor(options = {}){
    super(options);
    this._name = 'zipcity';
  }

  _clean(a) {
    for (let index = a.length - 1; index >=0; index--) {
      if (a[index].trim().length === 0) {
        a.splice(index, 1)
      }
    }
    return a;
  }
  adjust(fieldName, data, logger = false) {
    // http://html5pattern.com/Postal_Codes

    if (typeof data === 'string') {
      let split = this._clean(data.split(/(^[1-9][0-9]{3}\s*[A-Z][A-Z])(.*)/i))

      if (split.length === 2) {
        return {
          zipcode: split[0].trim(),
          city: split[1].trim()
        }
      }
      // check belgium
      split = this._clean(data.split(/(^[A-Za-z][\s-]?[0-9]{4})\s?(.*)/i))
      if (split.length === 2) {
        return {
          zipcode: split[0].trim(),
          city: split[1].trim()
        }
      }
    } else {
      logger.warn('zipcity: data must be a string')
    }
    return false
  }
}
module.exports.FieldTextZipCity = FieldTextZipCity;




