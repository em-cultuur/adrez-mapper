/**
 * The field base class for creating other types
 */


class ErrorNotValid extends Error {
  constructor(field, message = false) {
    super(message ? message : `field ${field}`);
    this.type = 'ErrorNotValid';
    this.fieldname = field
  }
}

/**
 * The empty value definition
 * - every field can be empty
 * - some fields define that the record should be stored if not empty
 * - some fields can have data but the record is not forced to be stored
 *
 * -- Every base field has a function isEmpty that returns true if the data is empty
 * what can be false, '', 0 or undefined. What every it is.
 * -- If the field is empty it is NEVER stored
 *
 * Every complex field can set the fields that need to be set if the data should be stored.
 * This can be one or multiple field
 *
 * There are 2 solutions to this problem.
 *  - per field there is a flag. So we can not relate to other field
 *  - there are field groups that define the data should be stored. So fields relate
 * We should use the later, because location uses a group definition like street, number, city etc.
 *
 * The complex definition is defined in the FieldObject not in the Field
 */


class Field {

  constructor(options = {}) {
    this._name = 'field';
  }

  get name() {
    return this._name;
  }

  log(logger, type, fieldName, message) {
    if (logger) {
      logger[type](fieldName, message);
    }
  }

  isEmpty(data) {
    return true;
  }
  /**
   * validate a fields properties (keys)
   * it ONLY checkes that the structure of data can be handled by this routine
   *
   * @param fieldName String,
   * @param data Object|String|Or what ever is given   *
   * @param logger Class logger class. if available the info is logged to this object
   * @return {boolean} True: it can be handled, False: structure has an error
   */
  validate(fieldName, data, logger = false) {
    return true;
  }

  /**
   * modifies the data so can be stored
   * @param fieldName
   * @param data
   * @param logger
   * @returns Promise with the the adjusted version of the data || Error
   */
  adjust(fieldName, data, logger = false) {
    return Promise.resolve(data);
  }
  /**
   * adjust the object. if error or warnings use the logger
   * @param object
   * @param logger
   * @param options
   */
  convert(fieldName, data, logger, parent = false) {
    if (this.validate(fieldName, data, logger)) {
      return this.adjust(fieldName, data, logger)
    }
  }
}

module.exports.Field = Field;
module.exports.ErrorNotValid = ErrorNotValid;
