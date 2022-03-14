const Chai = require('chai');
const assert = Chai.assert;
const _ = require('lodash');
const Logger = require('logger');
const Lookup = require('../lib/lookup');
const FieldUrl = require('../field/field-url').FieldUrl;

describe('field.url', () => {

  let logger = new Logger({toConsole: false});
  class LookupTypeUrl  extends Lookup {
    async url(fieldName, def) {
      if (def.guid === 'URL_WEB') {
        return Promise.resolve('web.guid')
      }
      if (def.text === 'new value') {
        return Promise.resolve(558)
      } else if (def.text === 'Instagram') {
        return Promise.resolve(559)
      }
      return Promise.resolve(def.parentIdDefault);
    }
  }


 // describe('type/typeId and value', () => {
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
    it('1. direct none changed values', async () => {
      let f2 = new FieldUrl({ lookup: new LookupTypeUrl()});
      let r = await f2.convert('url', {value: 'www.test.com', typeId: '123'}, logger);
      assert.equal(r.value, 'www.test.com', 'nothing changed');
      assert.equal(r.typeId, '123', 'nothing changed');
    });
    it('1. direct none changed values', async () => {
      let f2 = new FieldUrl({ lookup: new LookupTypeUrl()});
      let r = await f2.convert('url', {value: 'www.test.com/site/info.php', typeId: '123'}, logger);
      assert.equal(r.value, 'www.test.com/site/info.php', 'nothing changed');
      assert.equal(r.typeId, '123', 'nothing changed');
    });
    it('3. use a predefined field type', async () => {
      let f2 = new FieldUrl({ lookup: new LookupTypeUrl()});
      let r = await f2.convert('url', {facebook: 'emcultuur'}, logger);
      assert.equal(r.value, 'emcultuur', 'nothing changed');
      assert.equal(r.typeId, 117, 'translate type to typeId');
    });
    it('4. create / use a user defined type based on the guid', async () => {
      let f2 = new FieldUrl({ lookup: new LookupTypeUrl()});
      let r = await f2.convert('url', {value: 'www.emcultuur.nl', typeGuid: 'URL_WEB', type: 'Website'}, logger);
      assert.equal(r.value, 'www.emcultuur.nl', 'nothing changed');
      assert.equal(r.typeId, 'web.guid', 'translate type to typeId');
    });


    it('6. translate from url', async () => {
      let f2 = new FieldUrl({ lookup: new LookupTypeUrl()});
      let r = await f2.convert('url', {url: 'http://www.facebook.com/emcultuur'}, logger);
      assert.equal(r.value, 'www.facebook.com/emcultuur', 'nothing should change because there is no type set, accept removing http');
      assert.equal(r.typeId, 117, 'translate type the basetype');
    });
    it('7. translate from url with no typeId', async () => {
      let f2 = new FieldUrl({ lookup: new LookupTypeUrl(),
        urls: {
          Instagram: {
            url: new RegExp('instagram\.com'),
            typeId: 117,
            name: 'instagram',
            type: 'Instagram',
            textRegEx: new RegExp('(?:https?:\\/\\/)?(?:www\\.)?instagram\\.com\\/(?:(?:\\w)*#!\\/)?(?:pages\\/)?(?:[\\w\\-]*\\/)*([\\w\\-\\.]*)')
          }
        }
      });
      let r = await f2.convert('url', {url: 'http://www.instagram.com/emcultuur'}, logger);
      assert.equal(r.value, 'www.instagram.com/emcultuur', 'nothing changed');
      assert.equal(r.typeId, 117, 'translated Instagram to typeId');
    });

 // });




 // describe('url',  () => {
    let f = new FieldUrl({lookup: new Lookup()});
    logger.clear();
    it('empty', async () => {
      let r = await f.convert('url', {url: '', _source: 'master'}, logger);
      assert.isEmpty(r, 'should clear a empty record')
    });
    it('empty if isDefault', async () => {
      let r = await f.convert('url', {url: '', _source: 'master', isDefault: true, _parent:'test', _mode: ['add']}, logger);
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
 // });

  it('leave empty', async () => {
    let f2 = new FieldUrl({ lookup: new Lookup(), removeEmpty : false});
    let r = await f2.convert('url', {url: ''}, logger);
    assert.equal(r.value, undefined, 'not there');
  });


  it('load direct types', async () => {
    let f2 = new FieldUrl({lookup: new Lookup(), removeEmpty: false});
    r = await f2.convert('url', {twitter: 'emcultuur'}, logger);
    assert.equal(r.value, 'emcultuur', 'just the name');
    assert.equal(r.typeId, '117', 'found type');
  });


  it('load default types', async () => {
    let f2 = new FieldUrl({ lookup: new Lookup(), removeEmpty: false});
    r = await f2.convert('url', {url: 'http://www.twitter.com/emcultuur'}, logger);
    assert.equal(r.value, 'www.twitter.com/emcultuur', 'just the name');
    assert.equal(r.typeId, '117', 'found type');

    r = await f2.convert('url', {url: 'http://www.linkedin.com/in/emcultuur'}, logger);
    assert.equal(r.value, 'www.linkedin.com/in/emcultuur', 'just the name');
    assert.equal(r.typeId, '117', 'found type');

    r = await f2.convert('url', {url: 'http://www.facebook.com/emcultuur'}, logger);
    assert.equal(r.value, 'www.facebook.com/emcultuur', 'just the name');
    assert.equal(r.typeId, '117', 'found type');

  });

  it('load special types', async () => {
    let f2 = new FieldUrl({
      lookup: new Lookup(), removeEmpty: false,
      urls: [
        {name: 'Instagram', url: 'instagram\.com', typeId: 154},
      ]
    });
    let r = await f2.convert('url', {url: 'http://www.instagram.com/in/toxus'}, logger);
    assert.equal(r.value, 'www.instagram.com/in/toxus', 'has url with name');
    assert.equal(r.typeId, '154', 'found type');
  });

  it('bug: missing ww of www.example.com', async() => {
    let f2 = new FieldUrl({ lookup: new Lookup(), removeEmpty: false});
    let r = await f2.convert('url', {url: 'www.example.com'}, logger);
    assert.equal(r.value, 'www.example.com', 'did leave it');
  });

  class LookupTypeUrl2  extends Lookup {
    async urlSubType(fieldname, typeName, defaultValue) {
      switch(typeName) {
        case 'facebook': return 99;
        case 'twitter' : return 98;
        case 'linkedin': return 97
      }
      return super.urlSubType(fieldname, typeName, defaultValue);
    }
  }
  it('set type of url like Facebook by config', async() => {
    let f2 = new FieldUrl({ lookup: new LookupTypeUrl2(), removeEmpty: false});
    r = await f2.convert('url', {url: 'https://www.twitter.com/emcultuur'}, logger);
    assert.equal(r.value, 'emcultuur', 'just the name');
    assert.equal(r.typeId, '98', 'found type');

    r = await f2.convert('url', {url: 'http://www.linkedin.com/in/emcultuur'}, logger);
    assert.equal(r.value, 'emcultuur', 'just the name');
    assert.equal(r.typeId, '97', 'found type');

    r = await f2.convert('url', {url: 'http://www.facebook.com/emcultuur'}, logger);
    assert.equal(r.value, 'emcultuur', 'just the name');
    assert.equal(r.typeId, '99', 'found type');

    r = await f2.convert('url', {"linkedin": "emcultuur"}, logger);
    assert.equal(r.value, 'emcultuur', 'just the name');
    assert.equal(r.typeId, '97', 'found type');

    r = await f2.convert('url', {"facebook": "emcultuur"}, logger);
    assert.equal(r.value, 'emcultuur', 'just the name');
    assert.equal(r.typeId, '99', 'found type');

  })

});
