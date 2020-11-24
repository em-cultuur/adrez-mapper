const Chai = require('chai');
const assert = Chai.assert;
const _ = require('lodash');
const Logger = require('logger');
const Lookup = require('../lib/lookup');
const FieldTelephone = require('../field/field-telephone').FieldTelephone;



describe('telephone',  () => {
  let logger = new Logger({toConsole: false});
  let f = new FieldTelephone({ lookup: new Lookup()});
  logger.clear();
  it('empty', async () => {
    let r = await f.convert('telephone', {telephone: '', _source: 'master'}, logger);
    assert(_.isEmpty(r), 'should clear a empty record')
  });
  it('select field', async () => {
    let r = await f.convert('telephone', {telephone: '0123456789', _source: 'master'}, logger);
    assert(r.value === '012-3456789', 'select tel en convert');
    r = await f.convert('telephone', {telephone: '0123456789', telephoneInt: '0123456789', _source: 'master'}, logger);
    assert(r.value === '+31 (12) 3456789', 'select tel international');
    r = await f.convert('telephone', {value: '09876543210', telephone: '0123456789', telephoneInt: '0123456789', _source: 'master'}, logger);
    assert(r.value === '09876543210', 'value is most favored');
    assert.isUndefined(r.telephone, 'removed unneeded fields');
    assert.isUndefined(r.telephoneInt, 'removed unneeded fields');
  });

  it('fill leading 0', async () => {
    let r = await f.convert('telephone', {telephone10: '123456789', _source: 'master'}, logger);
    assert.equal(r.value, '012-3456789', 'add 0 and convert');
    r = await f.convert('telephone', {telephone10: '0123456789', _source: 'master'}, logger);
    assert.equal(r.value, '012-3456789', 'add 0 and convert');
    r = await f.convert('telephone', {telephone10Int: '123456789', _source: 'master'}, logger);
    assert.equal(r.value, '+31 (12) 3456789', 'add 0 and convert');

  });

 it('process', async () => {
    class TelLook extends Lookup {
    }
    let f2 = new FieldTelephone({ lookup: new TelLook(), removeEmpty : false});
    let r = await f2.convert('telephone', {"type": "mobiel KRM",  "_parent": "contact"}, logger);
    assert.isUndefined(r.value, 'No value');
  });

  it('emailadres/telefoon en adres naar code_ID 115,113, 11 #12', async () => {
    class TelLook extends Lookup {
    }
    let f2 = new FieldTelephone({ lookup: new TelLook(), removeEmpty : false});
    let r = await f2.convert('telephone', {
      "telephone10": "206253215",
      "isDefault": true
    },logger);
    assert.equal(r.isDefault, true, 'makes it default');
    assert.equal(r.value, '020-6253215', 'makes it default');
    assert.equal(r.typeId, 113, 'is a telephone')
  });

  it('makes it mobile', async() => {
    let f2 = new FieldTelephone({ removeEmpty : false});
    let r = await f2.convert('telephone', {
      "mobile": "612345678",
      "isDefault": true
    },logger);
    assert.equal(r.isDefault, true, 'makes it default');
    assert.equal(r.value, '06-12345678', 'makes it default');
    assert.equal(r.typeId, 114, 'is a mobile')
  });

  it('force a type', async() => {
    let f2 = new FieldTelephone({ removeEmpty : false});
    let r = await f2.convert('telephone', {
      "value": "772345678",
      "isDefault": true
    },logger);
    assert.equal(r.isDefault, true, 'makes it default');
    assert.equal(r.value, '772345678', 'makes it default');
    assert.equal(r.typeId, 113, 'raw telephone')
  });


  describe('mode', async() => {
    let f = new FieldTelephone();
    it('set', async () => {
      let r = await f.convert('telephone', {mobile: '061234567', _mode:'add'}, logger);
      assert.isDefined(r._mode);
      assert.equal(r._mode, 1)
    });
  });

  describe('empty telephone', async() => {
    let f = new FieldTelephone();
    it('empty', async () => {
      let r = await f.convert('telephone', {type: '1234', _mode: 'add'}, logger);
      assert.equal(Object.keys(r).length, 0, 'has to remove everything');
    })
  })
});
