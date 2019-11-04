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
    return Promise.resolve(defaults);
  }
  async telephone(fieldName, value, defaults, data) {
    return Promise.resolve(defaults);
  }
  async contact(fieldName, value, defaults, data) {
    return Promise.resolve(defaults);
  }
  async email(fieldName, value, defaults, data) {
    return Promise.resolve(defaults);
  }
  async memo(fieldName, value, defaults, data) {
    return Promise.resolve(defaults);
  }
  async extra(fieldName, value, defaults, data) {
    return Promise.resolve(defaults);
  }
  async code(fieldName, value, defaults, data) {
    return Promise.resolve(defaults);
  }
  async gender(fieldName, value, defaults, data) {
    return Promise.resolve(defaults);
  }
  async contactFunction(fieldname, value, defaults, data) {
    return Promise.resolve(defaults)
  }
  async contactSalutation(fieldname, value, defaults, data) {
    return Promise.resolve(defaults);
  }
  async zipcode2Country(fieldname, value, defaults, data) {
    return Promise.resolve(defaults);
  }
  async zipcode(fieldName, streetObj, defaults, data) {
    return Promise.resolve(defaults);
  }
  async country(fieldname, country, defaults, data) {
    return Promise.resolve(defaults);
  }
  async countryStreetNumberRight(fieldName, countryId, defaults, data) {
    return Promise.resolve(defaults);
  }

  /**
   * give the the zipcode + number => return the street + city
   * @param fieldName
   * @param locationObj {zipcode, number, countryId }
   * @param defaults { street, city }
   * @param data
   * @return {Promise<unknown>}
   */
  async street(fieldName, locationObj, defaults, data) {
    return Promise.resolve(defaults);
  }

  /**
   * looks for the sourceId by the text type
   * @param fieldName
   * @param campaignObj Object: {type}
   * @param defaults Number
   * @param data
   * @return {Promise<unknown>}
   */
  async campaign(fieldName, campaignObj, defaults, data) {
    return Promise.resolve(defaults);
  }

  /**
   * looks for the sourceId by the text type
   * @param fieldName
   * @param campaignObj Object: {group}
   * @param defaults Number
   * @param data
   * @return {Promise<unknown>}
   */
  async campaignGroup(fieldName, campaignObj, defaults, data) {
    return Promise.resolve(defaults);
  }

  /**
   * defines the codeId of a campaign2code
   * @param fieldName
   * @param campaignObj
   * @param defaults
   * @param data
   * @return {Promise<unknown>}
   */
  async campaignCode(fieldName, campaignObj, defaults, data) {
    return Promise.resolve(defaults);
  }

  /**
   * lookup the type of the campaign to contact definition
   *
   * @param fieldName
   * @param campaignObj
   * @param defaults
   * @param data
   * @return {Promise<unknown>}
   */
  async campaignContact(fieldName, campaignObj, defaults, data) {
    return Promise.resolve(defaults);
  }
}

module.exports = Lookup;
