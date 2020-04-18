# adrez-mapper
_version: 0.6.0_
```sh
npm install https://github.com/em-cultuur/adrez-mapper.git --save
```
Convert a raw address record into the workable version for the AdreZ api

## Revisions
see: [CHANGELOG.md](CHANGELOG.md)

## Explain:
- [typeId/type and value](doc/typeId.md)
- [code tree creation](doc/code.md)

````javascript
const Record = require('adrez-mapper').AdrezRecord;
const Logger = require('logger');
const Lookup = require('adrez-mapper').Lookup;


class LocalLookup extends Lookup {
   // see Lookup for more options   
   async gender(fieldName, contactObj, defaults, data) {
     // do anything to data and return the type of address
     return 105;
   }
}
let logger = new Logger({toConsole: false});

const options = {
  // the default lookup
  lookup : new LocalLookup(),
}

let upd = new Record(options);
const fieldData = {
  contact: [{ name: 'Tester'}],
  telephone: [
    {type: 'mobile', telephoneInt: '06123455667'}, 
    {typeId: 2314, telephone: '021030120123012'}
    ]
}

let result = upd.convert('rec', fieldData, logger);
console.log(result)
    {
      contact: [
        { name: 'Tester'}
        ],
      telephone: [ 
        {typeId: 12345, value: '+31 123455667'},
        {typeId: 2314, value: '021030120123012'}
      ]
    }

````

## structure

The adrezync record structure has the following properties:
````javascript
let record = {
  contact: [
    {
      typeId: 'guid',
      typeGuid: 'guid',
      _source: 'string',
      
      title: 'string',
      firstName: 'string',
      firstLetters: 'string',
      nickName: 'string',
      middleName: 'string',
      namePrefix: 'string',
      name: 'string',
      nameSuffix: 'string',

      // fields that are split into the above fields
      fullName: 'string',    // the fullName is recalucated to the "propper" value

      isDefault: 'boolean',  // default contact for the organisation

      functionId: 'guid',     // fixed id of the guid. If not found, funciton added with guid
      functionGuid: 'guid',   // the guid of the function
      function: 'string',     // added if not found with the guid

      salutationId: 'guid',   // the fix id
      salutationGuid: 'guid', // if found used
      salutation: 'string',   // search if not found added with the guid

      isOrganisation: 'boolean', // if true, organisation is place in name and type is set
      organization: 'string',

      _key: 'string',             // the key for this organisation
      _parent: 'string',      // links the contact to the organisation by key      
  
      locator: {              // the lookup definition. The fields are AND
        fullName: 'string',   // if one of the field === undefined it's removed
        name: 'string',       // if one of the fields === '' it will remain  
        subName: 'string',
        guid: 'string',
        search: 'string',
        id: 'string',
        typeId: 'string',
        type: 'string'
      }     
    }
  ],
  telephone: [
    {
      typeId: 'guid',   // if given, type is ignored, otherwise type translated to typeId
      typeGuid: 'guid', // if found used for the look/add
      type: 'string',   // if not guid, look this up, or add with guid
      typeIsDefault: 'boolean', // make it the default type

      value: 'string',
      isDefault: 'bool',
      _source: 'string',
      _parent: 'string',  // the contact it belongs to (contact._key)
      
      // fields recalculated
      // make a fix layout of the telephone
      telephone: 'string',
      // make a fix international layout of the telephone
      telephoneInt: 'string',
      // add the missing 0 if it's a number
      telephone10: 'string',
      // and the internation version
      telephone10Int: 'string'
    }
  ],
  email: [
    {
      typeId: 'guid',   // if given, type is ignored, otherwise type translated to typeId
      typeGuid: 'guid', // if found, used, otherwisd type added with this guid
      type: 'string',
      typeIsDefault: 'boolean', // make it the default type

      value: 'string',
      isDefault: 'bool',
      _source: 'string',
      _parent: 'string',  // the contact it belongs to (contact._key)
      
      email: 'string',
      // add the type Newsletter 
      newsletter: 'string',
      // add the type Privé
      prive: 'string'
    }
  ],
  url: [
    {
      typeId: 'guid',   // if given, type is ignored, otherwise type translated to typeId
      typeGuid: 'guid', // same as email 
      type: 'string',
      typeIsDefault: 'boolean', // make it the default type

      value: 'string',
      isDefault: 'bool',
      _source: 'string',
      _parent: 'string',  // the contact it belongs to (contact._key)
      
      // input: url: 'http://www.em-cultuur.com:81/test?x=2     
      url: 'string',
      // www.em-cultuur.com:81/test?x=2
      // it will scan on Twitter, Facebook, t   
      hostPath: 'string',
      // www.em-cultuur.com
      origin: 'string'    
    } 
  ], 
  location: [
    {
      typeId: 'guid',   // if given, type is ignored, otherwise type translated to typeId
      typeGuid: 'guid', // same as url 
      type: 'string',     
      typeIsDefault: 'boolean', // make it the default type

      street: 'string',
      number: 'string',
      suffix: 'string',
      zipcode: 'string',
      city: 'string',
      countryId: 'string', // if countryId is given, country is ignored      
      country: 'string',

      _source: 'string',
      _parent: 'string',  // the contact it belongs to (contact._key)

      // if street or number are missing
      streetNumber: 'string'
    }    
  ],
  code: [
    {        
        typeId: 'guid',   // if given, type is ignored, otherwise type translated to typeId         
        type: 'string',
        guid: 'string',   // the guid is newly created
        typeIsDefault: 'boolean', // make it the default type

        value: 'string',
        _source: 'string',
        _parent: 'string',  // the contact it belongs to
        parentCode: 'string',   // the link in the tree
        parentCodeId: 'string',
        parentCodeGuid: 'string'                
    }
  ],
  memo: [
    {
      typeId: 'guid',   // if given, type is ignored, otherwise type translated to typeId
      typeGuid: 'guid',          
      type: 'string', 
      typeIsDefault: 'boolean', // make it the default type

      description: 'string',   // if set over rulse text
      text: 'string',          
      useDescription: boolean  // force a special way of storing 
    }
  
  ], 
  extra: [
    {
        typeId: 'guid',   // if given, type is ignored, otherwise type translated to typeId
        typeGuid: 'guid',         
        type: 'string',
        typeIsDefault: 'boolean', // make it the default type
    
        text: 'string',
        description: 'string',
        boolean: 'boolean',
        number: 'number',
        groupId: 'guid'
} 
  ],
  
  campaign: [
    { 
      guid: 'string',
      title: 'string',
      campaignDate: 'string',
      isActive: 'string',
      description: 'string',
      group: 'string',
      groupId: 'number',
    // the action that added to campaignContact
      actionId : 'number',
      action: 'string',

      _key: 'string',
      locator : {
        title: 'string',
        id: 'string',
        sync: 'string'
      }
    } 
  ],
  campaignCode: [
    {
        typeId: 'guid',   // if given, type is ignored, otherwise type translated to typeId
        typeGuid: 'guid',         
        type: 'string',
        value: 'string',
        _source: 'string',
        _parent: 'string',  // the contact it belongs to   
    }
  ],
  campaignContact: [
    {
      text: 'string',
      _campaign: 'string',
      _contact: 'string'
    }
  ] 
}
````

## url
The url definition of the parser can be configured so it automatically analyses the type of url send. This option
makes it possible to identify facebook, linkedIn and twitter accounts. The list of urls to recognize can be
adjusted by adding options to the initial creation of the record.

example:
```javascript
let rec = new Record({removeEmpty: true,  url: {
    urls: { 
       instagram: { 
         url: 'instagram\.com', 
         typeId: 146,
         textRegEx: '(?:https?:\/\/)?(?:www\.)?twitter\.com\/(?:(?:\w)*#!\/)?(?:[\w\-]*\/)*([\w\-\.]*)' 
       }        
    }}}
  );
```
properties:
- object name: the identifies the parser. If the parser already exist the existing one is overwritten
  the name is also available for direct access to the property. This means that by creating the field
  instagram, the definition is also available in the data record by the name. So the two following examples 
  are the same
```javascript
  {
    "instagram": "emcultuur"
  },
  {
    "url": "http://www.instagram.com/emcultuur" 
  }
```
Both will produce the data record of:
```javascript
  {
    "value": "emcultuur",
    "typeId": 146
  }
```  
- url; the regEx for analysing the url
- typeId: defines the type of record it will become
- type: if defined and typeId is **not** defined it can be used to create new codes
- textRegEx: the regexpression that extracts the name of the account. If found it will overrule the url
  and replace it.



# [class Lookup](lookup.md)

### lookup function

The folling **baseType** can be expected:
- contact - value is **text** of type, result is the **typeId**
- telephone - value is **text**, result is the **id**
- url - value is **text** result is **id**
- email - value is **text**, result is the **id**
- code - value is **text**, result is the **id**
- extra - value is **text**, result is the **id**
- memo - value is **text**, result is the **id**

- country - value is the name of the country, result is the **countryId** 
- country.zipcode - value is the zipcode. Try to find a country for it. return **countryId** or **undefined**
- country.numberRight - value is the countryId. **true** if number is on the right.
- street - value is the Object: {zipcode, number, countryId}, result: the name of the **street**
- zipcode - value is the Object: {street, number, city, countryId}, result: the name of the **zipcode**
- zipcode - value is **zipcode**, try to find the country, returns the **countryId** or **undefined**
   
- gender - value is object {**firstName**, **title**, **subName**}, returns the **typeId**. It's allowed to modify the
**data** object to reflect the gender change. Return **false** or **undefined** if no change is needed. Overrules the 
record defined **typeId**, so **typeId** will be the default.
- contactFunction - the value is the textual definition of the function, returns the id
- contactSalutation the value is the salutation, returns the id


- campaign - find the type of campaign 
- campaignGroup - defines the group used in the campaign
- campaignAction - defines the action of the campaign contact
- campaignCode - translates the type to the codeId
- campaignContact - translate the type in campaign-to-contact


&copy; MIT 2019-2020 Jay/EM
