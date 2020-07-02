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
    async country(fieldname, data ) {
      if (data.country && data.country.toLowerCase() === 'nederland') {
        return 500
      }
      if (data.country && data.country.toLowerCase() === 'belgië') {
        return 501
      }
      if (data.guid && data.guid === 'ADREZ_CNT_GB') {
        return 502
      }
      return super.country(fieldname, data);
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

    async location(fieldName, def) {
      if (def.text === 'test') {
        return '1234'
      } else {
        return def.parentIdDefault;
      }
    }
  }

  let f = new FieldLocation({
    lookup: new LookupLocation()
  });


  describe('street - bugs', () => {

    logger.clear();
    it('wrong number', async () => {
      let r = await f.convert('location', {streetNumber: 'Guntersteinweg 377.1.22',}, logger);
      assert.equal(r.street, 'Guntersteinweg 377.1.22', 'no change')
    });
    it('no number', async () => {
      let r = await f.convert('location', {streetNumber: 'Jan De Louterpad',}, logger);
      assert.equal(r.street, 'Jan De Louterpad', 'remove all')
    });
    it('strange combination', async () => {
      let r = await f.convert('location', {streetNumber: 'Postbus 12808/Frankemaheerd 2',}, logger);
      assert.equal(r.street, 'Postbus 12808/Frankemaheerd', 'remove all')
    });
    it('strange combination', async () => {
      let r = await f.convert('location', {streetNumber: 'Dr. Jan van Breemenstraat 1 – ruimte E5',}, logger);
      assert.equal(r.street, 'Dr. Jan van Breemenstraat 1 – ruimte E5', 'remove all')
    });
    it('strange combination', async () => {
      let r = await f.convert('location', {streetNumber: 'Joubertstraat 15, 2e verdieping',}, logger);
      assert.equal(r.street, 'Joubertstraat 15', 'remove all')
    });

  });

  describe('only zipcode, number, type', async() => {
    it('unset', async () => {
      let r = await f.convert('location', {
        number: '25',
        zipcode: '1069AB'
      }, logger);
      assert.isDefined(r.typeId, 'has typeId')
    });
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
        countryGuid: 'ADREZ_CNT_GB',
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
  });

  describe('type translate', async() => {
    it('translate type to id', async () => {
      let r = await f.convert('location', {
        street: '',
        city: 'Amsterdam',
        number: '67',
        zipcode: '1017 TE',
        country: 'nederland',
        type: 'test',
        _source: 'master'
      }, logger);
      assert.equal(r.typeId, '1234', 'found');
    });
  });

  describe('zipcode text', async() => {
    it('translate type to id', async () => {
      logger.clear();
      let r = await f.convert('location', {
        "zipcode" : "INTERNE POST",
        "typeId" : 111,
        "isDefault" : "true",
        "_parent" : "main"
      }, logger);
      assert.equal(r.zipcode, 'INTERNE POST');
    });
  });

  describe('zipcode text', async() => {
    const street = [
      {value: "Nieuwe gracht 224 2", street: 'Nieuwe gracht 224', number: '2', suffix: '', comment: 'number is not right'},
      {value: "Plein 1945 1", street: 'Plein 1945', number: '1', suffix: ''},
      {value: "Straat 12 '", street: 'Straat', number: '12', suffix: '\''},
      {value: "Straat 12 '\"", street: 'Straat', number: '12', suffix: '\'"'},
      {value: "Laan 1940-’45 66", street: 'Laan 1940-\'45', number: '66', suffix: ''},
      {value: "Dr. J. Straat 12-14", street: 'Dr. J. Straat', number: '12', suffix: '-14'},
      {value: "Plataanstraat 5", street: 'Plataanstraat', number: '5', suffix: ''},
      {value: "Plataanstraat 5B", street: 'Plataanstraat', number: '5', suffix: 'B'},
      {value: "Plataanstraat 5 B", street: 'Plataanstraat', number: '5', suffix: 'B'},
      {value: "Straat 12", street: 'Straat', number: '12', suffix: ''},
      {value: "Straat 12 II", street: 'Straat', number: '12', suffix: 'II'},
      {value: "Dr. J. Straat   12", street: 'Dr. J. Straat', number: '12', suffix: ''},
      {value: "Dr. J. Straat 12 a", street: 'Dr. J. Straat', number: '12', suffix: 'a'},

//       {value: "Laan 1940–1945 37", street: 'Laan 1940 – 1945', number: '37', suffix: ''},
      {value: "Plein 1940 2", street: 'Plein 1940', number: '2', suffix: ''},
      {value: "1213-laan 11", street: '1213-laan', number: '11', suffix: ''},
      {value: "16 april 1944 Pad 1", street: '16 april 1944 Pad', number: '1', suffix: ''},
      {value: "1e Kruisweg 36", street: '1e Kruisweg', number: '36', suffix: ''},
      {value: "Boisotkade 2A", street: 'Boisotkade', number: '2', suffix: 'A'},
      {value: "Laan '40-`45", street: 'Laan \'40-\'45', number: undefined, suffix: undefined},
      {value: "Langeloërduinen 3 46", street: 'Langeloërduinen 3', number: '46', suffix: '', comment: 'suffix is wrong'},
      {value: "Marienwaerdt 2e Dreef 2", street: 'Marienwaerdt 2e Dreef', number: '2', suffix: ''},
      {value: "Provincialeweg N205 1", street: 'Provincialeweg N205', number: '1', suffix: ''},
      {value: "Rivium 2e Straat 59.", street: 'Rivium 2e Straat 59.', number: undefined, suffix: undefined, comment: '. and the can not parsed' },
      {value: "Nieuwe gracht 20rd", street: 'Nieuwe gracht', number: '20', suffix: 'rd'},
      {value: "Nieuwe gracht 21rd 2", street: 'Nieuwe gracht 21rd', number: '2', suffix: '', comment: 'number is place with the street'},
      {value: "Nieuwe gracht 20zw /2", street: 'Nieuwe gracht', number: '20', suffix: 'zw /2'},
      {value: "Nieuwe gracht 20zw/3", street: 'Nieuwe gracht', number: '20', suffix: 'zw/3'},
      {value: "Nieuwe gracht 20 zw/4", street: 'Nieuwe gracht', number: '20', suffix: 'zw/4'},
      {value: "Nieuwe gracht 24 -2", street: 'Nieuwe gracht', number: '24', suffix: '-2'},
      {value: "p/a Nieuwe gracht 24 -2", street: 'p/a Nieuwe gracht', number: '24', suffix: '-2'},
      {value: "Nieuwe gracht 24 2hoog", street: 'Nieuwe gracht 24', number: '2', suffix: 'hoog', comment: 'number is on the street'},
      {value: "Nieuwe gracht 24 2\"", street: 'Nieuwe gracht 24', number: '2', suffix: '"'},
      {value: "Bahnhofstr. 4", street: 'Bahnhofstr.', number: '4', suffix: ''},

      {value: "p/a P.C. Hooftstraat 15", street: 'p/a P.C. Hooftstraat', number: '15', suffix: ''},
      {value: "Graaf FLorisstraat 10 4- hoog", street: 'Graaf FLorisstraat 10', number: '4', suffix: '- hoog', comment: 'number moved to address (1945('},
      {value: "Graaf FLorisstraat 10 /4", street: 'Graaf FLorisstraat', number: '10', suffix: '/4'},
      {value: "Jacob van Lennepkade 153- I\"", street: 'Jacob van Lennepkade', number: '153', suffix: '- I"'},
      {value: "1e Jan van der Heijdenstraat 44-2 A", street: '1e Jan van der Heijdenstraat', number: '44', suffix: '-2 A'},
      {value: "Cornelis v/d Lindenstraat 1\"", street: 'Cornelis v/d Lindenstraat', number: '1', suffix: '"'},
      {value: "Frans Halsstraat 46 - II\"", street: 'Frans Halsstraat', number: '46', suffix: '- II"'},
      {value: "Lange Slachterijstraat 32 bus II\"", street: 'Lange Slachterijstraat', number: '32', suffix: 'bus II"'},
      {value: "Hoogte Kadijk 49 - C\"", street: 'Hoogte Kadijk', number: '49', suffix: '- C"'},
      {value: "Grevelingenstr 16 (2)", street: 'Grevelingenstr', number: '16', suffix: '(2)'}


    ]
    it('translate street', async () => {
      for (let l = 0; l < street.length; l++) {
        logger.clear();
        let r = await f.convert('location', {
          "streetNumber": street[l].value,
        }, logger);
        assert.equal(r.street, street[l].street, street[l].value);
        assert.equal(r.number, street[l].number, street[l].value)
        assert.equal(r.suffix, street[l].suffix, street[l].value);
        // let r2 = await f.convert('location', {
        //   "streetNumber": r.street
        // })
        // assert.equal(r2.street, street[l].street, street[l].value);
      }
    });

  });

});
