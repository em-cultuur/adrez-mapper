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
    assert(r.value === '09876543210', 'value is most favor');
    assert.isUndefined(r.telephone, 'removed unneeded fields');
    assert.isUndefined(r.telephoneInt, 'removed unneeded fields');
  });

  it('leave empty field', async () => {
    let f2 = new FieldTelephone({ lookup: new Lookup(), removeEmpty : false});
    let r = await f2.convert('telephone', {telephone: ''}, logger);
    assert.isDefined(r.value, 'still there');
    assert.equal(r.value, '', 'and empty')
  });

  it('process', async () => {
    class TelLook extends Lookup {

    }
    let f2 = new FieldTelephone({ lookup: new TelLook(), removeEmpty : false});
    let r = await f2.convert('telephone', {"type": "mobiel KRM",  "_parent": "contact"}, logger);
    assert.isUndefined(r.value, 'No value');
  })
});
