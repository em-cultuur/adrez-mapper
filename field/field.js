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


class Field {

  constructor(options = {}) {
    this._name = 'field';
    this.emptyAllow = options.emptyAllow === undefined ? true : options.emptyAllow
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
  convert(fieldName, data, logger) {
    if (this.validate(fieldName, data, logger)) {
      return this.adjust(fieldName, data, logger)
    }
  }
}

module.exports.Field = Field;
module.exports.ErrorNotValid = ErrorNotValid;
