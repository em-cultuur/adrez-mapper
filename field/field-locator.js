/**
 * bass class for the locator
 * @type {FieldObject}
 */

const FieldComposed = require('./field-composed').FieldComposed;
const FieldText = require('./field-text').FieldText;
const FieldGuid = require('./field-text').FieldTextGuid;

class FieldLocator extends FieldComposed {

  /**
   * all empty fields should be handled as no store, but of one field is not empty it should be handle as stored
   *
   * so we try to find the rule where not every field is empty.
   * if we find one rule, we return ok
   *
   * @param data
   */
  mustStoredRecord(data) {

    if (super.mustStoredRecord(data)) {
      for (let group in this.storeGroups) {
        let groupValid = true;
        for (let fieldIndex = 0; fieldIndex < this.storeGroups[group].length; fieldIndex++) {
          let fieldName = this.storeGroups[group][fieldIndex];
          if (!data.hasOwnProperty(fieldName)) {
            groupValid = false
            break; // does not have the field so skip this group
          } else if (typeof data[fieldName] === 'string' && data[fieldName].trim().length === 0 ) {
            groupValid = false
            break;
          }
        }
        if (groupValid) {
          return true;
        }
      }
    }
    return false;
  }
}

class FieldLocatorText extends FieldText {

  /**
   * overloaded so '' string are excepted
   * @param data
   * @return {boolean}
   */
  isEmpty(data) {
    if (data === undefined) return true;
    return false;
  }
}

class FieldLocatorGuid extends FieldGuid {
  /**
   * overloaded so '' string are excepted
   * @param data
   * @return {boolean}
   */
  isEmpty(data) {
    if (data === undefined) return true;
    return false;
  }


}

module.exports.FieldLocator = FieldLocator;
module.exports.FieldLocatorText = FieldLocatorText;
module.exports.FieldLocatorGuid = FieldLocatorGuid;
