/**
 * Test Location Fields
 */
const Chai = require('chai');
const assert = Chai.assert;
const _ = require('lodash');
const Logger = require('logger');
const Lookup = require('../lib/lookup');
const Countries = require('../field/field-text-zipcode').Countries;
const FieldLocation = require('../field/field-location').FieldLocation;


describe('field.location', () => {
  let logger = new Logger({toConsole: false});

  class LookupLocation extends Lookup {
    async country(fieldname, country, defaults, data) {
      if (country.toLowerCase() === 'nederland') {
        return 500
      }
      if (country.toLowerCase() === 'belgië') {
        return 501
      }
      if (country.toLowerCase() === 'engeland') {
        return 502
      }
      return super.country(fieldname, country, defaults, data);
    }

    async countryStreetNumberRight(fieldName, countryId, defaults, data) {
      return (countryId === 502) ? true : defaults;
    }

    async street(fieldName, locationObj, defaults, data) {
      return { street: `${locationObj.zipcode}:${locationObj.number}`, city: 'not'};
      //return super.street(fieldName, locationObj, defaults, data);
    }


    async zipcode(fieldName, streetObj, defaults, data) {
      return `${streetObj.city}:${streetObj.street}:${streetObj.number}`;
    }
  }

  let f = new FieldLocation({
    lookup: new LookupLocation()
  });

  describe('street', () => {

    logger.clear();
    it('empty', async () => {
      let r = await f.convert('location', {street: '', city: '', zipcode: '', country: '', _source: 'master'}, logger);
      assert(_.isEmpty(r), 'remove all')
    });
    it('find country', async () => {
      let r = await f.convert('location', {
        street: '',
        city: 'Amsterdam',
        zipcode: '',
        country: 'nederland',
        _source: 'master'
      }, logger);
      assert.equal(r.countryId, 500, 'found us');
      r = await f.convert('location', {
        street: '',
        city: 'Brussel',
        zipcode: '',
        country: 'België',
        _source: 'master'
      }, logger);
      assert.equal(r.countryId, 501, 'found');
      r = await f.convert('location', {
        street: '12 test street 99',
        city: 'London',
        zipcode: '',
        country: 'Engeland',
        _source: 'master'
      }, logger);
      assert.equal(r.countryId, 502, 'found');
      assert.equal(r.street, '12 test street 99', 'did not change the street');
      r = await f.convert('location', {street: '', city: 'Amsterdam', zipcode: 'B-1234', _source: 'master'}, logger);
      assert(r.countryId === Countries.be, 'found');
      r = await f.convert('location', {street: '', city: 'Amsterdam', zipcode: '12345', _source: 'master'}, logger);
      assert(r.countryId === Countries.de, 'found');
    });
  });
  describe('street', () => {
    logger.clear();
    it('split', async () => {
      let r = await f.convert('location', {
        streetNumber: 'Westerstraat 12 huis',
        city: 'Amsterdam',
        zipcode: '',
        _source: 'master'
      }, logger);
      assert.equal(r.street, 'Westerstraat', 'found');
      assert(r.number === '12', 'found');
      assert.equal(r.zipcode, 'Amsterdam:Westerstraat:12', 'did a lookup');
      assert(r._source === 'master', 'no process but still there')
    });
    it('lookup street from zipcode', async () => {
      let r = await f.convert('location', {
        street: '',
        city: 'Amsterdam',
        number: '67',
        zipcode: '1017 TE',
        country: 'nederland',
        _source: 'master'
      }, logger);
      assert.equal(r.street, '1017 TE:67', 'found');
      assert.equal(r.city, 'not', 'and set the city');
    });
  });
  describe('is default', async() => {
    it('unset', async () => {
      let r = await f.convert('location', {
        streetNumber: 'Westerstraat 12 huis',
        city: 'Amsterdam',
        zipcode: '',
        _source: 'master'
      }, logger);
      assert.equal(r.isDefault, undefined, 'not defined')
    });
    it('set true', async () => {
      let r = await f.convert('location', {
        streetNumber: 'Westerstraat 12 huis',
        city: 'Amsterdam',
        zipcode: '',
        _source: 'master',
        isDefault: true
      }, logger);
      assert.isDefined(r.isDefault, 'defined')
      assert.isTrue(r.isDefault, 'and true')
    });

    it('validate street', async () => {
      let r = await f.convert('location', {
        streetNumber: 'Wijnhaven 23',
        city: 'Amsterdam',
        zipcode: '',
        countryId: '500',
        _source: 'master',
        isDefault: true
      }, logger);
      assert.equal(r.street, 'Wijnhaven', 'waarom geen bier');
      assert.equal(r.number, '23', 'has number');
      assert.equal(r.countryId, '500', 'has country');
    });

  })
});
