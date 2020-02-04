const Chai = require('chai');
const assert = Chai.assert;
const _ = require('lodash');
const Logger = require('logger');
const Lookup = require('../lib/lookup');
const FieldUrl = require('../field/field-url').FieldUrl;

describe('field.url', () => {

  let logger = new Logger({toConsole: false});
  class LookupTypeUrl {
    async url(fieldName, url, defaults, data) {
      if (url === 'new value') {
        return Promise.resolve(558)
      } else if (url === 'Instagram') {
        return Promise.resolve(559)
      }
      return Promise.resolve(defaults);
    }
  }


  describe('type/typeId and value', () => {
    it('1. direct none changed values', async () => {
      let f2 = new FieldUrl({ lookup: new LookupTypeUrl()});
      let r = await f2.convert('url', {value: 'test.com', typeId: '123'}, logger);
      assert.equal(r.value, 'test.com', 'nothing changed');
      assert.equal(r.typeId, '123', 'nothing changed');
    });
    it('2. create / use a user defined type', async () => {
      let f2 = new FieldUrl({ lookup: new LookupTypeUrl()});
      let r = await f2.convert('url', {value: 'test.com', type: 'new value'}, logger);
      assert.equal(r.value, 'test.com', 'nothing changed');
      assert.equal(r.typeId, 558, 'translate type to typeId');
    });
    it('3. use a predefined field type', async () => {
      let f2 = new FieldUrl({ lookup: new LookupTypeUrl()});
      let r = await f2.convert('url', {Facebook: 'emcultuur'}, logger);
      assert.equal(r.value, 'emcultuur', 'nothing changed');
      assert.equal(r.typeId, 142, 'translate type to typeId');
    });
    it('4. translate from url', async () => {
      let f2 = new FieldUrl({ lookup: new LookupTypeUrl()});
      let r = await f2.convert('url', {url: 'http://www.facebook.com/emcultuur'}, logger);
      assert.equal(r.value, 'emcultuur', 'nothing changed');
      assert.equal(r.typeId, 142, 'translate type to typeId');
    });
    it('5. translate from url with no typeId', async () => {
      let f2 = new FieldUrl({ lookup: new LookupTypeUrl(),
        urls: {
          Instagram: {
            url: new RegExp('instagram\.com'),
            type: 'Instagram',
            textRegEx: new RegExp('(?:https?:\\/\\/)?(?:www\\.)?instagram\\.com\\/(?:(?:\\w)*#!\\/)?(?:pages\\/)?(?:[\\w\\-]*\\/)*([\\w\\-\\.]*)')
          }
        }
      });
      let r = await f2.convert('url', {url: 'http://www.instagram.com/emcultuur'}, logger);
      assert.equal(r.value, 'emcultuur', 'nothing changed');
      assert.equal(r.typeId, 559, 'translated Instagram to typeId');
    });

  });




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
