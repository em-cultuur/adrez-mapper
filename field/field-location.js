/**
 * Field Location
 */

const FieldText = require('./field-text').FieldText;
const FieldGuid = require('./field-text').FieldTextGuid;

// const FieldObject = require('./field-object').FieldObject;
const FieldComposed = require('./field-composed').FieldComposed;
const FieldZipcode = require('./field-text-zipcode').FieldTextZipcode;
const _ = require('lodash');

class FieldLocation extends FieldComposed {

  constructor(options = {}) {
    super(options);
    this.baseTypeId = options.baseTypeId !== undefined ? options.baseTypeId : 111;
    this.defaultCountryId = options.defaultCountryId ? options.defaultCountryId : 500;
    this.lookupFunctionName = 'location';
    this.emptyValueAllowed = true;

    this._fields.street = new FieldText({ emptyAllow: false});
    this._fields.number = new FieldText();
    this._fields.suffix = new FieldText();
    this._fields.streetNumber = new FieldText({ emptyAllow: false});
    this._fields.zipcode = new FieldZipcode(_.merge(options, {emptyAllow: false}));
    this._fields.city = new FieldText({ emptyAllow: false});
    this._fields.country = new FieldText({emptyAllow: true});
    this._fields.countryId = new FieldGuid({emptyAllow: true});
    this._fields.countryGuid = new FieldGuid({emptyValueAllowed: true})
    delete this._fields.value;
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

    if (!data.countryId) {
      if (data.countryGuid) {
        result.countryId = await this.lookup.country(fieldName, {guid: data.countryGuid})
      } else if (data.country) {
        result .countryId = await this.lookup.country(fieldName, {country: data.country})
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

    let countryNumberRight = await this.lookup.countryStreetNumberRight(fieldName, data.countryId, true, data);

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
          // we do not parse other formats
          data.street = data.streetNumber;
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

}

module.exports.FieldLocation = FieldLocation;
