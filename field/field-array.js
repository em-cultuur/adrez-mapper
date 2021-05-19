/**
 * convert an array
 */

const Field = require('./field').Field;
const FieldText = require('./field-text').FieldText;
const _ = require('lodash');



class FieldArray extends Field {

  constructor(options = {}, moreOptions = {}){
    super(options);
    this._name = 'array';
    this._type = options.type ? options.type : new FieldText();
    this._removeEmpty = moreOptions.removeEmpty  !== undefined ? moreOptions.removeEmpty : true;
  }


  /**
   *
   * @param fieldName String
   * @param data Array
   * @param logger
   */
  validate(fieldName, data, logger = false) {
    let isValid = true;
    if (Array.isArray(data)) {
      let fieldDefinition = this._type;
      for (let l = 0; l < data.length; l++) {
        let subName = `${fieldName}[${l}]`;
        isValid = fieldDefinition.validate(subName, data[l], logger);
      }
      return isValid;
    } else {
      this.log(logger, 'error', fieldName, 'field is not an array')
      return false;
    }
  }

  /**
   * check if all element are empty
   * @param data
   * @return {boolean}
   */
  isEmpty(data) {
    for (let l = 0; l < data.length; l++) {
      if (!this._type.isEmpty(data[l])) {
        return false;
      }
    }
    return true;
  }
  /**
   * adjust the object. if error or warnings use the logger
   * @param fieldName String
   * @param data Object
   * @param logger Class logger
   * @return Promise (array || undefined if no element)
   */

   async convert(fieldName, data, logger = false) {
    let result = [];

    if (Array.isArray(data)) {
      let fieldDefinition = this._type;
      for (let l = 0; l < data.length; l++) {
        let subName = `${fieldName}[${l}]`;
        let elm = await fieldDefinition.convert(subName, data[l], logger);
        if (!_.isEmpty(elm) || this._removeEmpty === false)
 //       if (this._removeEmpty === false || !fieldDefinition.isEmpty(elm)) {
          result.push(elm);
 //       }
      }
      if (result.length === 0) {
        return Promise.resolve(undefined)
      }
    } else {
      this.log(logger, 'error', fieldName, 'field is not an array')
    }
    return Promise.resolve(result);
  }
}

module.exports.FieldArray = FieldArray;
