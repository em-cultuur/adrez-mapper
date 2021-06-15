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

  async contact(fieldName, value, defaults, data) {
    return Promise.resolve(defaults);
  }
  // lookup values in the code table
  async telephone(fieldName, def) {
    return Promise.resolve(def.parentIdDefault);
  }
  async email(fieldName, def) {
    return Promise.resolve(def.parentIdDefault);
  }
  async url(fieldName, def) {
    return Promise.resolve(def.parentIdDefault);
  }
  async memo(fieldName, def) {
    return Promise.resolve(def.parentIdDefault);
  }
  async extra(fieldName,def) {
    return Promise.resolve(def.parentIdDefault);
  }
  async code(fieldName, def) {
    return Promise.resolve(def.parentIdDefault);
  }
  async location(fieldName, def) {
    return Promise.resolve(def.parentIdDefault);
  }
  async campaignCode(fieldName, def) {
    return Promise.resolve(def.parentIdDefault);
  }

  // extra lookup (code but specific)
  async gender(fieldName, value, defaults, data) {
    return Promise.resolve(105);
  }
  async contactFunction(fieldName, def) {
    return Promise.resolve(def.parentIdDefault);
  }
  async contactSalutation(fieldName, def) {
    return Promise.resolve(def.parentIdDefault);
  }

  async zipcode2Country(fieldname, value, defaults, data) {
    return Promise.resolve(defaults);
  }
  async zipcode(fieldName, streetObj, defaults, data) {
    return Promise.resolve(defaults);
  }

  /**
   *
   * @param fieldname
   * @param country Object {guid, country}
   * @return {Promise<number>} the id of the country
   */
  async country(fieldname, country) {
    return Promise.resolve(0);
  }

  /**
   * checks if the number is on the right side.
   * @param fieldName
   * @param countryId
   * @param data the full data definition
   * @return {Promise<true>}
   */
  async countryStreetNumberRight(fieldName, countryId, data) {
    return Promise.resolve(true);
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
   * looks for the syncId by the text type
   * @param fieldName
   * @param type String
   * @param defaults Number
   * @param data
   * @return {Promise<unknown>}
   */
  async campaign(fieldName, def) {
    return Promise.resolve(require('../field/field-campaign').DEFAULT_CAMPAIGN_TYPE);
  }

  /**
   * looks for the groupId by the text type
   * @param fieldName
   * @param campaignObj Object: {group}
   * @param defaults Number
   * @param data
   * @return {Promise<unknown>}
   */
  async campaignGroup(fieldName, def) {
    return Promise.resolve(require('../field/field-campaign').DEFAULT_CAMPAIGN_GROUP);
  }


  /**
   * lookup the type of the address2campaign.typeId
   *
   * @param fieldName
   * @param contact
   * @param defaults
   * @param data
   * @return {Promise<unknown>}
   */
  async campaignContact(fieldName, def) {
    return Promise.resolve(0);
  }

  /**
   * translate the action in to a Campaign specific Code Id
   * @param fieldName
   * @param action String the action variable
   * @param defaults Number
   * @param data
   * @return {Promise<unknown>}
   */
  async campaignCode(fieldName, def) {
    return Promise.resolve(require('../field/field-campaign').DEFAULT_CAMPAIGN_ACTION);
  }
}

module.exports = Lookup;
