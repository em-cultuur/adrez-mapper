/**
 *
 */
const Chai = require('chai');
const assert = Chai.assert;
const Logger = require('logger');
const Record = require('../field/record').AdrezRecord;
const Lookup = require('../lib/lookup');

describe('record', () => {
  let logger = new Logger({toConsole: false});


  describe('url load remote config', () => {
    it('load config with instagram', async () => {
      let rec = new Record({removeEmpty: true,  url: {urls: [
            { name: 'facebook', url: 'facebook\.com', typeId: 141},
            { name: 'instagram',  url: 'instagram\.com', typeId: 154},
            { name: 'linkedIn', url: 'www\.linkedin\.com\/in\/', typeId: 142},
            { name: 'twitter', url: 'twitter\.com', typeId: 143 }
          ]
        }});
      //{url: 'http://www.facebook.com'}
      let result = await rec.convert('remoteConfig', {url: [{url: 'http://www.instagram.com'}, { url: 'www.linkedin.com/in/jaap'}]});
      assert.equal(result.url.length, 2,'2 urls');
      assert.equal(result.url[0].typeId, 154, 'did set the type');
    });
    it('contact - no tel', async () => {
      let rec = new Record({removeEmpty: true});
      let data = {
        "contact": [
          {"fullName": "Customer"}
        ],
        "telephone": [
          {
            "type": "mobiel KRM",
            "_parent": "contact"
          }
        ]
      };
      let result = await rec.convert('name', data);
      assert.isUndefined(result.telephone, 'remove key if all is empty')
    });
  });

  describe('convert', () => {
    let rec = new Record();
    it('empty', async () => {
      let r = await rec.convert('rec', {}, logger);
      assert(Object.keys(r).length === 0, 'nothing created')
    });


    it('unknown fields', async () => {
      let r;
      try {
        r = await rec.convert('rec', {test: '123'}, logger);
        assert.fail('field does not exist')
      } catch (e) {
        assert.isDefined(e.name, 'got result')
        assert.equal(e.type, 'ErrorFieldNotAllowed', 'got the error')
        assert(logger.hasErrors(), 'something is wrong');
        assert(logger.errors.length === 1, 'one error');
        assert(logger.errors[0].message === 'field does not exist', 'not found');
        assert(logger.errors[0].fieldName === 'rec.test', 'defined the field')
      }
    });
    it('convert fields', async () => {
      let r = await rec.convert('rec', {telephone: [{telephoneInt: '0123456789'}]}, logger);
      assert(r.telephone[0].value === '+31 (12) 3456789', 'did the convert')
    });
  });
  describe('lookup composed type', () => {
    logger.clear();
    class ComposedLookup extends Lookup {
      async email(fieldName, value, defaults, data) {
        return 1234
        // return super.code(fieldName, value, defaults, data);
      }
    }

    let rec = new Record({
      email: {
        lookup: new ComposedLookup()
        // lookup: async function(value, baseType, fields, data) {
        //   return Promise.resolve(1234);
        // }
      }
    });
    it('convert fields', async () => {
      let r = await rec.convert('rec', {email: [{email: 'info@test.com', type: 'work'}]}, logger);
      assert.equal(r.email[0].value,'info@test.com', 'did the convert');
      assert.isUndefined(r.email[0].type, 'removed type');
      assert.equal(r.email[0].typeId, 1234, 'did read it');
    });
  });

  describe('lookup code.code', () => {
    logger.clear();
    class CodeLookup extends Lookup {
      async code(fieldName, value, defaults, data) {
        return 33;
      }
    }
    let rec = new Record({
      lookup: new CodeLookup()
      // lookup: async function(value, baseType, fields, data) {
      //   return 33
      // }
    });
    it('convert fields', async () => {
      let r = await rec.convert('rec', {code: [{code: 'newsletter'}]}, logger);
      assert.equal(r.code[0].typeId, 33, 'did the convert');
    });
  });

  describe('multikey', () => {
    let rec = new Record();
    it('more keys', async () => {
      let r = await rec.convert('rec', {contact: [{name: 'test'}], telephone: [{telephone: '1234124'}]}, logger);
      assert(Object.keys(r).length === 2, 'both exist')
    });
  });

  describe('fieldName or rec', () => {

    let rec = new Record();
    it('name is long string', async () => {
      logger.clear();
      let r = await rec.convert('theLongName', {contact: [{name: 'test'}], telephone: [{telephone: '1234124'}]}, logger);
      assert.isFalse(logger.hasErrors(), 'no errors')
    })
  });

  describe('empty remove', () => {
    it('remove empty', async () => {
      let rec = new Record({removeEmpty: true});
      let result = await rec.convert('name', {telephone: [{telephone: '123', typeId: 456}, { telephone: '', typeId: '789'}]});
      assert.equal(result.telephone.length, 1, 'remove second, typeId not used in empty calc')
    });
    it('leave empty', async () => {
      let rec = new Record({removeEmpty: false});
      let result = await rec.convert('name', {telephone: [{telephone: '123', typeId: 456}, { telephone: '', typeId: '789'}]});
      assert.equal(result.telephone.length, 2, 'both remain')
    });
    it('leave empty', async () => {
      let rec = new Record({removeEmpty: false});
      let result = await rec.convert('name', {telephone: [{ telephone: '', typeId: '789'}]});
      assert.equal(result.telephone.length, 1, 'one remain')
    });
  });

  describe('telephone block remove', () => {
    it('remove empty', async () => {
      let rec = new Record({removeEmpty: true});
      let result = await rec.convert('name', {telephone: [{type: "mobiel KRM",   _parent: "contact"}, { telephone: '', typeId: '789'}]});
      assert.isUndefined(result.telephone, 'remove key if all is empty')
    });
    it('contact - no tel', async () => {
      let rec = new Record({removeEmpty: true});
      let data = {
        "contact": [
          {"fullName": "Customer"}
        ],
        "telephone": [
          {
            "type": "mobiel KRM",
            "_parent": "contact"
          }
        ]
      };
      let result = await rec.convert('name', data);
      assert.isUndefined(result.telephone, 'remove key if all is empty')
    });
  });





});
