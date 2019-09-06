/**
 * class for create the lookup basics
 */

class Lookup {

  constructor(options = {}) {
    this._logger = options.logger;
  }
  get logger() {
    return this._logger;
  }
  /**
   * the global execute class
   * @param value
   * @param baseType
   * @param data
   * @returns {Promise<void>}
   */
  async exec(fieldName, value, baseType, defaults, data) {

  }
  async composed(fieldName, value, defaults, data) {
    return defaults;
  }
  async telephone(fieldName, value, defaults, data) {
    return defaults;
  }
  async contact(fieldName, value, defaults, data) {
    return defaults;
  }
  async email(fieldName, value, defaults, data) {
    return defaults;
  }
  async memo(fieldName, value, defaults, data) {
    return defaults;
  }
  async extra(fieldName, value, defaults, data) {
    return defaults;
  }
  async code(fieldName, value, defaults, data) {
    return defaults;
  }
  async gender(fieldName, value, defaults, data) {
    return defaults;
  }
  async zipcode2Country(fieldname, value, defaults, data) {
    return defaults;
  }
  async zipcode(fieldName, streetObj, defaults, data) {
    return defaults;
  }
  async country(fieldname, country, defaults, data) {
    return defaults;
  }
  async countryStreetNumberRight(fieldName, country, defaults, data) {
    return defaults;
  }
  async street(fieldName, locationObj, defaults, data) {
    return defaults;
  }

}

module.exports = Lookup;