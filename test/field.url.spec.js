const Chai = require('chai');
const assert = Chai.assert;
const _ = require('lodash');
const Logger = require('logger');
const Lookup = require('../lib/lookup');
const FieldUrl = require('../field/field-url').FieldUrl;

describe('field.url', () => {

  let logger = new Logger({toConsole: false});
  describe('url',  () => {
    let f = new FieldUrl({lookup: new Lookup()});
    logger.clear();
    it('empty', async () => {
      let r = await f.convert('url', {url: '', _source: 'master'}, logger);
      assert.isEmpty(r, 'should clear a empty record')
    });
    it('select field', async () => {
      let r = await f.convert('url', {url: 'http://www.em-cultuur.com:81/test?x=2', _source: 'master'}, logger);
      assert.equal(r.value,'www.em-cultuur.com:81/test?x=2', 'select url en convert');
//      r = await f.convert('href', {href: 'http://www.em-cultuur.com:81/test?x=2', _source: 'master'}, logger);
//      assert.equal(r.value, 'http://www.em-cultuur.com:81/test?x=2', 'href');
      r = await f.convert('hostPath', {hostPath: 'http://www.em-cultuur.com:81/test?x=2', _source: 'master'}, logger);
      assert.equal(r.value, 'www.em-cultuur.com:81/test?x=2', 'hostPath');
      r = await f.convert('origin', {origin: 'http://www.em-cultuur.com:81/test?x=2', _source: 'master'}, logger);
      assert.equal(r.value,'www.em-cultuur.com', 'origin');

    });
  });

  it('leave empty', async () => {
    let f2 = new FieldUrl({ lookup: new Lookup(), removeEmpty : false});
    let r = await f2.convert('url', {url: ''}, logger);
    assert.equal(r.value, undefined, 'not there');
  });

  it('load direct types', async () => {
    let f2 = new FieldUrl({lookup: new Lookup(), removeEmpty: false});
    r = await f2.convert('url', {Twitter: 'emcultuur'}, logger);
    assert.equal(r.value, 'emcultuur', 'just the name');
    assert.equal(r.typeId, '140', 'found type');
  });


  it('load default types', async () => {
    let f2 = new FieldUrl({ lookup: new Lookup(), removeEmpty: false});
    r = await f2.convert('url', {url: 'http://www.twitter.com/emcultuur'}, logger);
    assert.equal(r.value, 'emcultuur', 'just the name');
    assert.equal(r.typeId, '140', 'found type');

    r = await f2.convert('url', {url: 'http://www.linkedin.com/in/emcultuur'}, logger);
    assert.equal(r.value, 'emcultuur', 'just the name');
    assert.equal(r.typeId, '143', 'found type');

    r = await f2.convert('url', {url: 'http://www.facebook.com/emcultuur'}, logger);
    assert.equal(r.value, 'emcultuur', 'just the name');
    assert.equal(r.typeId, '142', 'found type');

  });

  it('load special types', async () => {
    let f2 = new FieldUrl({
      lookup: new Lookup(), removeEmpty: false,
      urls: [
        {name: 'Instagram', url: 'instagram\.com', typeId: 154},
      ]
    });
    let r = await f2.convert('url', {url: 'http://www.linkedin.com/in/toxus'}, logger);
    assert.equal(r.value, 'toxus', 'has url with name');
    assert.equal(r.typeId, '143', 'found type');
  });

});
