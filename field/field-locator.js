/**
 * bass class for the locator
 * @type {FieldObject}
 */

const FieldComposed = require('./field-composed').FieldComposed;
const FieldText = require('./field-text').FieldText;
const FieldGuid = require('./field-text').FieldTextGuid;

class FieldLocator extends FieldComposed {

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
