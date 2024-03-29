/**
 * Test the Fields
 */
const Chai = require('chai');
const assert = Chai.assert;
const _ = require('lodash');
const Logger = require('logger');
const Lookup = require('../lib/lookup');
const FieldContact = require('../field/field-contact').FieldContact;

const DEFAULT_FUNCTION = require('../field/field-contact').DEFAULT_FUNCTION;
const DEFAULT_SALUTATION = require('../field/field-contact').DEFAULT_SALUTATION;
const DEFAULT_ORGANISATION = require('../field/field-contact').DEFAULT_ORGANISATION;

describe('field.contact', () => {
  let logger = new Logger({toConsole: false});

  class ContactLookup extends Lookup {
    async contact(fieldName, value, defaults, data) {
      const types = [{name: 'instituut', value: 101}, {name: 'man', value: 102}, {name: 'vrouw', value: 103}];
      let id = _.find(types, (t) => {
        return t.name === value
      });
      if (id) {
        return id.value
      }
      return super.contact(fieldName, value, defaults, data);
    }

    async gender(fieldName, value, data) {
      if (value.title === 'mevrouw') {
        delete data.title;
        return 103
      }
      if (value.type === 'man') {
        return 102
      }
      if (value.typeGuid === 'ADREZ_MALE') {
        return 101
      }
      return super.gender(fieldName, value, data);
    }

    async contactFunction(fieldname, definition) {
      if (definition.id) {
        return '1'
      } else if (definition.guid) {
        return '2'
      } else if (definition.text) {
        return '3'
      } else {
        return '-1'
      }
    }
    async contactSalutation(fieldname, definition) {
      if (definition.id) {
        return '1'
      } else if (definition.guid) {
        return '2'
      } else if (definition.text) {
        return '3'
      } else {
        return definition.parentIdDefault
      }
    }

  }
  let f = new FieldContact({
    lookup: new ContactLookup()
  });
//
//
//   describe('empty check', () => {
//     it('empty', async() => {
//       let r = await f.convert('contact', {type: 'echk', salutationId: 123}, logger);
//       assert.isTrue(_.isEmpty(r));
//     })
//     it('name', async() => {
//       let r = await f.convert('contact', {name: 'Jay', salutationId: 123}, logger);
//       assert.equal(r.name, 'Jay');
//     })
//     it('organisation', async() => {
//       let r = await f.convert('contact', {organisation: 'Leaper', salutationId: 123}, logger);
//       assert.equal(r.name, 'Leaper');
//     })
//
//   })
//
//   describe('salutation',  () => {
//     it('has salutationId', async() => {
//       let r = await f.convert('contact', {fullName: 'Jan de Hond', salutationId: 123}, logger);
//       assert.isDefined(r.salutationId, 'got salutationId');
//       assert.equal(r.salutationId, '1', 'and set')
//     });
//     it('translate from text', async () => {
//       let r = await f.convert('contact', {fullName: 'Jan de Hond', salutation: 'hi'}, logger);
//       assert.isDefined(r.salutationId, 'got salutationId');
//       assert.equal(r.salutationId, '3', 'and set');
//       assert.equal(r.salutation, undefined, 'did remove the text')
//     });
//     it('translate from guid', async () => {
//       let r = await f.convert('contact', {fullName: 'Jan de Hond', salutationGuid: 'hi'}, logger);
//       assert.isDefined(r.salutationId, 'got salutationId');
//       assert.equal(r.salutationId, '2', 'and set');
//     });
//
//     it('set default', async () => {
//       let r = await f.convert('contact', {fullName: 'Jan de Hond', salutationGuid: false}, logger);
//       assert.isDefined(r.salutationId, 'no salutation Id');
//       assert.equal(r.salutationId, DEFAULT_SALUTATION, 'and set');
//     });
//     it('missing if not set', async () => {
//       let r = await f.convert('contact', {fullName: 'Jan de Hond'}, logger);
//       assert.isUndefined(r.salutationId);
//     });
//
//   });
//
//   describe('fullName',  () => {
//     logger.clear();
//     it('fullname', async () => {
//       let r = await f.convert('contact', {fullName: 'Jan de Hond '}, logger);
//       assert(r.firstName === 'Jan' && r.name === 'Hond' && r.namePrefix === 'de', 'got all');
//       r = await f.convert('contact', {fullName: 'dr. J. de Hond'}, logger);
//       assert(r.title === 'dr.' && r.firstName === undefined && r.firstLetters === 'J.' && r.name === 'Hond' && r.namePrefix === 'de', 'got all');
//       r = await f.convert('contact', {fullName: 'Jan Willem de Boer'}, logger);
//       assert(r.firstLetters = 'J.W.' && r.firstName === 'Jan' && r.middleName === 'Willem' && r.name === 'Boer' && r.namePrefix === 'de', 'got all');
//       r = await f.convert('contact', {fullName: 'Jack (mojo) Man'}, logger);
//       assert(r.firstName === 'Jack' && r.name === 'Man' && r.firstLetters === 'J.' && r.nickName === 'mojo', 'got all');
//       r = await f.convert('contact', {fullName: 'Jan Willem Overmars'}, logger);
//       assert(r.firstName === 'Jan' && r.middleName === 'Willem' && r.firstLetters === 'J.W.' && r.name === 'Overmars', 'got all');
//       r = await f.convert('contact', {fullName: 'sergeant majoor Bert de Vries'}, logger);
//       assert(r.firstName === 'Bert' && r.name === 'Vries' && r.firstLetters === 'B.' && r.title === 'sergeant majoor', 'got all');
//       r = await f.convert('contact', {fullName: 'Abt Jan'}, logger);
//       assert(r.name === 'Jan' && r.title === 'Abt', 'got all');
//       r = await f.convert('contact', {fullName: 'Familie E. de Boer-Brenninkmeijer'}, logger);
//       assert(r.name === 'Boer-Brenninkmeijer' && r.firstLetters === 'E.' && r.namePrefix === 'de', 'got all');
//       r = await f.convert('contact', {fullName: 'Vera de Boer-van Woerdens'}, logger);
//       assert(r.name === 'Woerdens' && r.firstLetters === 'V.B.' && r.middleName === 'Boer-van', 'got all');
//       r = await f.convert('contact', {fullName: 'Jaap-Wieger van der Kreeft'}, logger);
//       assert(r.name === 'Kreeft' && r.firstLetters === 'J.' && r.namePrefix === 'van der' && r.firstName === 'Jaap-Wieger', 'got all');
//       r = await f.convert('contact', {fullName: 'Jaap Wieger van der Kreeft'}, logger);
//       assert(r.name === 'Kreeft' && r.firstLetters === 'J.W.' && r.namePrefix === 'van der' && r.firstName === 'Jaap' && r.middleName === 'Wieger', 'got all');
//       r = await f.convert('contact', {fullName: 'Jaap Wieger van der Kreeft'}, logger);
//       assert(r.name === 'Kreeft' && r.firstLetters === 'J.W.' && r.namePrefix === 'van der' && r.firstName === 'Jaap' && r.middleName === 'Wieger', 'got all')
//
//     })
//   });
//
//
//   describe('name', async () => {
//     logger.clear();
//     it('fullname', async () => {
//       let r = await f.convert('contact', {fullName: 'Annemarie Manger- Havengildediner 2019'}, logger);
//       assert.equal(r.name, '2019', 'got the name');
//     })
//     it('spaces', async() => {
//       let r = await f.convert('contact', {name: ' McAnser ', firstName: ' Jay '}, logger);
//       assert.equal(r.name, 'McAnser', 'got the name');
//       assert.equal(r.firstName, 'Jay', 'got the name');
//     })
//   });
//
//
//   describe('type and lookup',  () => {
//     logger.clear();
//
//     it('type', async () => {
//       let r = await f.convert('contact', {fullName: 'Jan de Hond', typeId: 101, type: 'man'}, logger);
//       assert.equal(r.typeId, 101, 'leave it');
//       r = await f.convert('contact', {fullName: 'Jan de Hond', type: 'man'}, logger);
//       assert.equal(r.typeId, 102, 'changed');
//       r = await f.convert('contact', {fullName: 'Jan de Hond'}, logger);
//       assert.equal(r.typeId, 105, 'add it if unknown');
//       r = await f.convert('contact', {fullName: 'Test Customer'}, logger);
//       assert.equal(r.typeId, 105, 'got type');
//       assert.equal(r.firstName, 'Test', 'name');
//       assert.equal(r.firstLetters, 'T.', 'letter');
//       assert.equal(r.name, 'Customer', 'name');
//     });
//     it('gender', async () => {
//       let r = await f.convert('contact', {fullName: 'mevrouw Clara de Hond'}, logger);
//       assert.equal(r.typeId, 103, 'did genderize on title');
//       r = await f.convert('contact', {fullName: 'dr Clara de Hond', typeId: 102}, logger);
//       assert.equal(r.typeId, 102, 'did genderize, result default')
//     })
//   });
//
//
//
//   describe('function',  () => {
//     it('has functionId', async() => {
//       let r = await f.convert('contact', {fullName: 'Jan de Hond', functionId: 123}, logger);
//       assert.isDefined(r.functionId, 'got functionId');
//       assert.equal(r.functionId, '1', 'and set')
//     });
//     it('translate from text', async () => {
//       let r = await f.convert('contact', {fullName: 'Jan de Hond', function: 'jobber'}, logger);
//       assert.isDefined(r.functionId, 'got functionId');
//       assert.equal(r.functionId, '3', 'and set');
//       assert.equal(r.function, undefined, 'did remove the function')
//     });
//     it('translate from guid', async () => {
//       let r = await f.convert('contact', {fullName: 'Jan de Hond', functionGuid: 'IMP_XXX'}, logger);
//       assert.isDefined(r.functionId, 'got functionId');
//       assert.equal(r.functionId, '2', 'and set');
//       assert.equal(r.function, undefined, 'did remove the function')
//     });
//     it('set default', async () => {
//       let r = await f.convert('contact', {fullName: 'Jan de Hond'}, logger);
//       assert.isUndefined(r.functionId, 'got functionId');
// //      assert.equal(r.functionId, -1, 'and set');
//     });
//   });
//
//   describe('organisation', () => {
//     const CNAME = 'Working it'
//     it('set organisation', async() => {
//       let r = await f.convert('contact', {organisation: CNAME, isOrganisation: true, functionId: '12'}, logger);
//       assert.isDefined(r.typeId);
//       assert.equal(r.typeId, DEFAULT_ORGANISATION, 'and set');
//       assert.equal(r.name, CNAME);
//       assert.equal(r.fullName, CNAME)
//       assert.equal(r.functionId, undefined, 'removed unwanted')
//       assert.isUndefined(r._mode);
//       assert.isUndefined(r._source);
//       assert.isUndefined(r._key);
//     });
//     it('set full name', async() => {
//       let r = await f.convert('contact', {fullName: CNAME, isOrganisation: true}, logger);
//       assert.isDefined(r.typeId);
//       assert.equal(r.typeId, DEFAULT_ORGANISATION, 'and set');
//       assert.equal(r.name, CNAME);
//       assert.equal(r.fullName, CNAME)
//     });
//     it('set name', async() => {
//       let r = await f.convert('contact', {organisation: CNAME, subName: 'test'}, logger);
//       assert.isDefined(r.typeId);
//       assert.equal(r.typeId, DEFAULT_ORGANISATION, 'and set');
//       assert.equal(r.subName, 'test')
//       assert.equal(r.name, CNAME);
//       assert.equal(r.fullName, CNAME)
//     });
//     it('name priority', async() => {
//       let r = await f.convert('contact', {fullName: CNAME, name: 'none', isOrganisation: true}, logger);
//       assert.isDefined(r.typeId);
//       assert.equal(r.typeId, DEFAULT_ORGANISATION, 'and set');
//       assert.equal(r.name, CNAME);
//       assert.equal(r.fullName, CNAME)
//     });
//     it('set typeId', async() => {
//       let r = await f.convert('contact', {name: CNAME, isOrganisation: true, typeId: 34}, logger);
//       assert.isDefined(r.typeId, 'got typeId');
//       assert.equal(r.typeId, 34, 'and set');
//     });
//
//     it('by flag', async() => {
//       let r = await f.convert('contact', {name: CNAME, isOrganisation: true, functionId: '12'}, logger);
//       assert.isDefined(r.typeId, 'got typeId');
//       assert.equal(r.typeId, DEFAULT_ORGANISATION, 'and set');
//       assert.equal(r.functionId, undefined, 'removed unwanted');
//       assert.equal(r.fullName, CNAME, 'got full name');
//       assert.equal(r.name, CNAME, 'got name');
//     });
//
//     it('with _ fields', async() => {
//       let r = await f.convert('contact', {name: CNAME, isOrganisation: true, _mode: 1, _key: 'noname', _source: 'source'}, logger);
//       assert.equal(r._mode, 1)
//       assert.equal(r._key, 'noname');
//       assert.equal(r._source, 'source')
//     });
//   });
//
//   describe('key/parent', () => {
//     it('store the key', async () => {
//       let r = await f.convert('contact', {name: 'Working it', _key: 'theKey'}, logger);
//       assert.isDefined(r._key, 'got key');
//       assert.equal(r._key, 'theKey', 'and set');
//     });
//     it('store the parent', async () => {
//       let r = await f.convert('contact', {name: 'Working it', _parent: 'theKey'}, logger);
//       assert.isDefined(r._parent, 'got key');
//       assert.equal(r._parent, 'theKey', 'and set');
//     })
//   });
//   describe('useParentLocation', () => {
//     it('set', async () => {
//       let r = await f.convert('contact', {name: 'Working it', useParentLocation: true}, logger);
//       assert.isDefined(r.useParentLocation, 'got key');
//       assert.equal(r.useParentLocation, true);
//     })
//     it('unset', async () => {
//       let r = await f.convert('contact', {name: 'Working it', useParentLocation: false}, logger);
//       assert.isDefined(r.useParentLocation, 'got key');
//       assert.equal(r.useParentLocation, false);
//     })
//
//   })
//
//   describe('locator', () =>  {
//     it('parse', async () => {
//       let r = await f.convert('contact', {name: 'Working it', locator: { fullName: 'test' }}, logger);
//       assert.isDefined(r.locator, 'has locator');
//       assert.isDefined(r.locator.fullName, 'look for');
//     });
//     it('guid', async () => {
//       let r = await f.convert('contact', {name: 'Working it', guid: 'g.1', locator: { guid: 'g.1' }}, logger);
//       assert.isDefined(r.locator, 'has locator');
//       assert.isDefined(r.locator.guid, 'look for');
//       assert.equal(r.guid, 'g.1', 'has guid')
//     });
//   })
//
//   describe('_parent (v: 0.5.8', () => {
//     it ('field', async () => {
//       let r = await f.convert('contact', {name: 'Working it', _campaign: 'check'}, logger);
//       assert.isDefined(r._campaign);
//       assert.isDefined(r._campaign, 'check');
//
//     })
//   });
//   describe('v: 0.5.12', () => {
//     it ('subName', async () => {
//       let r = await f.convert('contact', {name: 'Working it', subName: 'department'}, logger);
//       assert.isDefined(r.subName);
//       assert.equal(r.subName, 'department');
//     })
//     it ('typeGuid', async () => {
//       let r = await f.convert('contact', {name: 'Working it', typeGuid: 'ADREZ_MALE'}, logger);
//       assert.isDefined(r.typeId);
//       assert.equal(r.typeId, 101);
//     })
//   });
//
//   describe('v: 1.3.2', () => {
//     it ('remove name prefix if not givene', async () => {
//       let r = await f.convert('contact', {name: 'Working it'}, logger);
//       assert.isDefined(r.namePrefix);
//       assert.equal(r.namePrefix, '');
//     })
//   });
//
//   describe('v:1.3.9 - sortName', () => {
//     it ('analyse sortName', async () => {
//       let r = await f.convert('contact', {sortName: 'McAnser, Jay'}, logger);
//       assert.isDefined(r.name);
//       assert.equal(r.name, 'McAnser');
//       assert.equal(r.firstName, 'Jay')
//     })
//
//     it('fullName overloads', async() => {
//       let r = await f.convert('contact', {fullName: 'John Doe', sortName: 'McAnser, Jay'}, logger);
//       assert.isDefined(r.name);
//       assert.equal(r.name, 'Doe');
//       assert.equal(r.firstName, 'John')
//     })
//
//     it('name overloads', async() => {
//       let r = await f.convert('contact', {name: 'Doe', sortName: 'McAnser, Jay'}, logger);
//       assert.isDefined(r.name);
//       assert.equal(r.name, 'Doe');
//     })
//   })
//
//   describe('v:1.6.2 - _source was removed', () => {
//     it ('analyse sortName', async () => {
//       let r = await f.convert('contact', {fullName: 'McAnser, Jay', _source: 'test'}, logger);
//       assert.isDefined(r.name);
//       assert.equal(r.name, 'McAnser');
//       assert.equal(r.firstName, 'Jay');
//       assert.isDefined(r._source);
//       assert.equal(r._source, 'test')
//     })
//   })
//
//   describe('_parent key set', () => {
//     it ('check its in the record', async () => {
//       let r = await f.convert('contact', {fullName: 'McAnser, Jay', _source: 'test', _parent: 'parentKey'}, logger);
//       assert.isDefined(r.name);
//       assert.isDefined(r._parent)
//       assert.equal(r._parent, 'parentKey')
//     })
//   })

  describe('search', () => {
    it ('person - filled', async () => {
      let r = await f.convert('contact', {name: 'Jay', search:'check'}, logger);
      assert.isDefined(r.name);
      assert.equal(r.name, 'Jay')
      assert.equal(r.search, 'check')
    })
    it ('person - empty', async () => {
      let r = await f.convert('contact', {name: 'Jay', search:''}, logger);
      assert.isDefined(r.name);
      assert.equal(r.name, 'Jay')
      assert.equal(r.search, '')
    })
    it ('person - undefined', async () => {
      let r = await f.convert('contact', {name: 'Jay', search: undefined}, logger);
      assert.isDefined(r.name);
      assert.equal(r.name, 'Jay')
      assert.isUndefined(r.search)
    })
    it ('organisation - filled', async () => {
      let r = await f.convert('contact', {organisation: 'Jay', search:'check'}, logger);
      assert.isDefined(r.name);
      assert.equal(r.name, 'Jay')
      assert.equal(r.search, 'check')
    })
    it ('organisation - empty', async () => {
      let r = await f.convert('contact', {organisation: 'Jay', search:''}, logger);
      assert.isDefined(r.name);
      assert.equal(r.name, 'Jay')
      assert.equal(r.search, '')
    })
    it ('organisation - undefined', async () => {
      let r = await f.convert('contact', {organisation: 'Jay', search: undefined}, logger);
      assert.isDefined(r.name);
      assert.equal(r.name, 'Jay')
      assert.isUndefined(r.search)
    })

  })
});

