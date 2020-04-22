/**
 * Field street. convert a street into steet, number, suffix
 */

const Field = require('./field').Field;

class FieldTextStreet extends Field {
  constructor(options = {}){
    super(options);
    this._name = 'number';
  }

  isEmpty(data) {
    if (data === undefined) return true;
    if (typeof data === 'string' && data.trim().length === 0) return true;
    // 0 / false is NOT empty
    return false;
  }

  /**
   * convert a street into readable version
   *
   * must remove number and suffix if not used
   *
   * @param fieldName
   * @param data
   * @param logger
   * @param parentData Object { streetNumber2, number, suffix}.
   *
   * @return {*}
   */
  convert(fieldName, data, logger, parentData) {
    const re = /^(\d*[\wäöüß\d '\-\.]+)[,\s]+(\d+)\s*([\wäöüß\d\-\/]*)$/i;
    let match = data.match(re);
    if (match) {
      match.shift(); // verwijder element 0=het hele item
      //match is nu altijd een array van 3 items
      data.street = match[0].trim();
      data.number = match[1].trim();
      data.suffix = match[2].trim();
    } else {
      this.log(logger, 'warn', fieldName + '.streetNumber', `can not parse: "${data.streetNumber}"`);
      data.street = data.streetNumber;
    }
  }
}
module.exports.FieldTextStreet = FieldTextStreet;
