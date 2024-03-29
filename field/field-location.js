/**
 * Field Location
 */

const FieldText = require('./field-text').FieldText;
const FieldGuid = require('./field-text').FieldTextGuid;
const FieldBoolean = require('./field-text-boolean').FieldTextBoolean;

// const FieldObject = require('./field-object').FieldObject;
const FieldComposed = require('./field-composed').FieldComposed;
const FieldZipcode = require('./field-text-zipcode').FieldTextZipcode;
const FieldZipCity = require('./field-text-zip-city').FieldTextZipCity
const _ = require('lodash');

class FieldLocation extends FieldComposed {

  constructor(options = {}) {
    super(options);
    this.baseTypeId = options.baseTypeId !== undefined ? options.baseTypeId : 111;
    this.defaultCountryId = options.defaultCountryId ? options.defaultCountryId : 500;
    this.lookupFunctionName = 'location';
    this.emptyValueAllowed = true;

    this._fields.street = new FieldText();
    this._fields.number = new FieldText();
    this._fields.suffix = new FieldText();
    this._fields.suffix = new FieldText();
    this._fields.streetNumber = new FieldText();
    this._fields.zipcode = new FieldZipcode(options);
    this._fields.zipCity = new FieldZipCity(options)
    this._fields.city = new FieldText();
    this._fields.country = new FieldText();
    this._fields.countryId = new FieldGuid();
    this._fields.countryGuid = new FieldGuid()
    this._fields.isPrimary = new FieldText(
      {
        emptyValueAllowed: true,
        validValues: [true, false, 'leave','all', 'allLeave'],
        isCaseInsensitive: true
      }) // can be true, false or leave
    delete this._fields.value;
    this.addStoreGroup('street', ['street', 'city'])
    this.addStoreGroup('zip', ['zipcode', 'number'])
 }

  /**
   * just process all keys individual
   *
   * @param fieldName
   * @param fields the field parsers
   * @param data the data given
   * @param logger Class where to store the errors
   */
  async processKeys(fieldName, fields, data, logger) {
    let result = {};
    let lookup = false;

    if (data.zipCity) {
      let r = await this._fields.zipCity.adjust(fieldName, data.zipCity, logger)
      if (r) {
        delete data.zipCity;
        Object.assign(data, r)
      } else {
        data.city = data.zipCity;
        delete data.zipCity
      }
    }
    if (!data.countryId) {
      if (data.countryGuid) {
        result.countryId = await this.lookup.country(fieldName, {guid: data.countryGuid})
      } else if (data.country) {
        result.countryId = await this.lookup.country(fieldName, {country: data.country})
      } else if (data.zipcode) {
        result.countryId = await this._fields.zipcode.countryId(data.zipcode, false);
        if (!result.countryId) {
          result.countryId = await this.lookup.zipcode2Country(fieldName, data.zipcode, 0, data);
        }
      }
      if (!result.countryId) {
        result .countryId = await this.lookup.country(fieldName, {country: ''})
      }
      delete data.countryGuid;
      delete data.country;
    } else {
      delete data.countryGuid;
      delete data.country;
    }
    if (!result.countryId) {
      result.countryId = this.defaultCountryId;
    }

    let countryNumberRight = await this.lookup.countryStreetNumberRight(fieldName, result.countryId, data);

    // streetNumber can be split if street and number do NOT exist
    if (data.street === undefined || data.number === undefined) {
      if (data.streetNumber) {
        const repChar = [
          {a:'`', b:'\''},
          {a:'’', b:'\''} ]
        for (let l = 0; l< repChar.length; l++) {
          data.streetNumber = data.streetNumber.replace(repChar[l].a, repChar[l].b);
        }
        if (countryNumberRight) {
          //  https://gist.github.com/christiaanwesterbeek/c574beaf73adcfd74997
           const re = /^(\d*[\p{L}\d '\/\\\-\.]+)[,\s]+(\d+)\s*([\p{L} \d\-\/'"\(\)]*)$/iu;
          //const re = /^(\d*[\p{L}\d '\/\\\-\.]+)[,\s]+(\d+)\s*([\p{L}\d\-\/]*)$/iu;

          let match = data.streetNumber.match(re);
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
        } else {
          // v1.9.0: we do parse the street number on the left side
          let streetNumber = this._parseLocal(data.streetNumber)
          data.street =  streetNumber.street;
          data.number = streetNumber.number;
        }
      }
    }

    if (data.zipcode && !data.street) {
      // do a lookup on zipcode for nl && b
      let d = await this.lookup.street(fieldName, { zipcode: data.zipcode, number: data.number, countryId: data.countryId}, {street: undefined, city: undefined}, data);
      data.street = d.street;
      data.city = d.city;

    }
    if (!data.zipcode && (data.street && data.number && data.city)) {
      data.zipcode = await this.lookup.zipcode(fieldName, { street: data.street, number: data.number, city: data.city, countryId: data.countryId}, undefined, data)
    }

    this.copyFieldsToResult(result, data, ['country', 'streetNumber']);

    let cFields = this.remapFields(result);
    return super.processKeys(fieldName, cFields, result, logger);
  }



  _isNumber(n) { return !isNaN(parseFloat(n)) && isFinite(n); }

// Check if character is a fraction, e.g. ¼
  _isFractionalChar(n) {
    let c = n.charCodeAt();
    return (c >= 188 && c <= 190) || (c >= 8531 && c <= 8542);
  }

// return the first fractional character in a string
// return false if there is none
// Could easily return the index of the character, but this creates a parallelism with RegExp.exec
  _indexFractionalChar(m) {
    var a = m.split(''), i;
    for (i in a) {
      if (this._isFractionalChar(a[i]))
        return i;
    }

    return false;
  }

  _cleanComma(text) {
    text = text.trim();
    if (text.substr(0, 1) === ',') {
      text = text.substr(1)
    }
    if (text.substr(text.length, 1) === ',') {
      text = text.substr(0, text.length - 1)
    }
    return text.trim();
  }
  _parseLocal(streetNr) {
// http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric/1830844#1830844
  /**
   * Splits an address into the number and street part.
   * with input: "100 Main Street", outputs: {number: "100", space: ' ', street: "Main Street"}
   * The special sauce is handling fractional addresses.
   * With input "22½ Baker Street", outputs: {number: "22½", space: ' ', street: "Baker Street"}
   *
   * @param string x An address with leading number
   * @return Object An object with the number, street and a space, for inserting between.
   * The space parameter is useful for situations where you want to glue the pieces back together for a user.
   * If user inputs "Main Street", without a number, .space is returned empty, so you don't have to bother testing
   * and just glue it like: x.number + x.space + x.street
   * while processing x.number and x.street separately on the back end.
   */

    let a = streetNr.trim().split(' ')
    let number
    let street;

    if (a.length <= 1)
      return {number: '', space: '', street: a.join('')};

    if (this._isNumber(a[0].substr(0, 1)) || this._isFractionalChar(a[0].substr(0, 1))) {
      number = a.shift();
    } else {
      // If there isn't a leading number, just return the trimmed input as the street
      return {number: '', space: '', street: x.trim()}
    }
    if (/[0-9]\/[0-9]/.exec(a[0]) || this._indexFractionalChar(a[0]) !== false)
      number += ' ' + a.shift();

    return {number: this._cleanComma(number), space: ' ', street: this._cleanComma(a.join(' '))};
  }
}

module.exports.FieldLocation = FieldLocation;
