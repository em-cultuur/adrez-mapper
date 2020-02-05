[Home](../README.md)

## type/typeId and value
The type/typeId add automatically the needed code to the code table. The rules to translate the definition
into the final required typeId.
- if the **typeId** is given, nothing is changed and this value is stored
- if the **value** is given (not the url, Facebook, mobile, telephone, etc), this value is stored and the typeId is calulated
from the type and the default subtype (telephone, url, email, etc)
- if a predefined type (url, Facebook, etc) is given the **typeId** is set by this type. If no **typeId** is available the **type** is used. If
the **type** is ommited the property name of the filter is used.

## using the lookup functions.
For all typeId that is unknown a lookup will be done. There are lookup function for code, email, extra, location memo, telephone, campaignCode and url. The class
can by itself check for the proper groupId


For every function there is a lookup function is defined in the class:
```javascript
  class MyLookup {
    url(fieldName, definition) {
      return Promise.resolve('value')
    }
    code(fieldName, definition) {
      return Promise.resolve('value')
    }
    // ...etc
  }
```
The definition is an object with the folling properties:
  - id: the _typeId_ requested
  - guid: the _guid_
  - text: the _caption_ of the code
  
  - fieldTypeId: the typeId in the code table
  - fieldTypeGuid: the guid of the typeId in the code table

  - parentIdDefault: the default value of the parent if nothing matches
  - parentId: the id of the parent if defined
  - parentGuid: the _guid_ of the parent,
  - parentText: the _caption_ of the parent

Rules:
- if the **id** is given that one is used
- if the **guid** is given, it's queried and if found the **id** of the record is used
- if the **caption** is given, it's queried within the groupId of the type. If found, the id is used
- if nothing is found but there is an **caption**, a new record is created with the **caption** and **groupId** and if available the **guid**
- if all fails and **parentIdDefault** is defined, it's used
- otherwise: **999999999** is used 
- if the **fieldTypdId** is given and found, it's used.
- if the **fieldTypeGuid** is give, it's queried. If found, it's used and stored in the **typeId**
- if the **fieldTypeGuid** is give, it's queried. If not found, it's added and stored in the **typeId**
- the same rules apply for the parent.

_The values not used are undefined_.

examples:

1. direct none changed values
```javascript
  {
    typeId: 1345,
    value: "the test"
  }
// result:
  {
    typeId: 1345,
    value: "the test"
  }
```

2. create / use a user defined type
```javascript
url: [
  {
    type: 'new type',
    value: "test.com"
  }
]
// calls the lookup.url() with: default codeId: 117 (that is the default codeId for url), data: "new type"
// lookup tries to find "new type" if not found added with parentUd = 117
// result:
url:[  {
    typeId: 558,
    value: "test.com"
  }
]
```

3. create / use a user defined type based on the guid
This is important that the end user can update the description but the type will still be the same. When creating
the import the designer can it _website_ while the end user can rename it to _website newsletter_. The code will still
be handled correct.
```javascript
url: [
  {
    type: 'new type',
    typeGuid: 'URL_NEW_TYPE',
    value: "test.com"
  }
]
// calls the lookup.url() with: typeGuid, type and parentId=117 to find/add the code
// result:
url:[  {
    typeId: 558,
    value: "test.com"
  }
]
```
4. create / use a user defined type based on the guid
The id overrules the guid and the text. If the id does not exist, the guid is used. If the guid isn't found a new item
is added with the guid and type. The parent will be the standard definition
```javascript
url: [
  {
    type: 'new type',
    typeId: 20,
    value: "test.com"
  }
]
// calls the lookup.url() with: typeId, type and parentId=117 to use code typeId = 20. if not found add the new type if not found with parentId = 117
// user can rename the type, but this code is still maintained
// result:
url:[  {
    typeId: 558,
    value: "test.com"
  }
]
```
5. overload the standard parent (117)
```javascript
url: [
  {
    type: 'new type',    
    parentId: 119,
    value: "test.com"
  }
]
// calls the lookup.url() with: type and parentId=119. if not found add add code { type, parentId = 119 }
// user can rename the type, but this code is still maintained
// result:
url:[  {
    typeId: 558,
    value: "test.com"
  }
]
```
6. overload the standard parent with a parent from a guid. If not the parent is added (parent.parent == 117)
The parent is defined by the guid
```javascript
url: [
  {
    type: 'new type',    
    parentGuid: 'ADREZ_WEB',
    parentText: 'The types',
    value: "test.com"
  }
]
// calls the lookup.url() with: type and parentId=119. if not found add add code { type, parent.guid = 'ADREZ_GUID' }
// user can rename the type, but this code is still maintained
// result:
url:[  {
    typeId: 558,
    value: "test.com"
  }
]
```


5. use a predefined field type
```javascript
url: [
  {
    Facebook: "em-cultuur"    
  }
]
// calls the lookup.url() with: default codeId: 117, data: Facebook
// lookup tries to find "Facebook" if not found added with parentUd = 117
// result:
url:[  {
    typeId: 142,
    value: "em-cultuur"
  }
]
```

6. translate from url
```javascript
url: [
  {
    url: "http://www.facebook.com/em-cultuur"    
  }
]
// calls the lookup.url() with: default codeId: 117, data: Facebook
// lookup tries to find "Facebook" if not found added with parentUd = 117
// result:
url:[  {
    typeId: 142,
    value: "em-cultuur"
  }
]
```


7. translate from url with no typeId
```javascript
// added
 let f2 = new FieldUrl({ lookup: new LookupTypeUrl(),
        urls: {
          Instagram: {
            url: new RegExp('instagram\.com'),
            type: 'Instagram',
            textRegEx: new RegExp('(?:https?:\\/\\/)?(?:www\\.)?instagram\\.com\\/(?:(?:\\w)*#!\\/)?(?:pages\\/)?(?:[\\w\\-]*\\/)*([\\w\\-\\.]*)')
          }
        }
      });

// so we can add
url: [
  {
    url: 'http://www.instagram.com/emcultuur'
  }
]

// calls the lookup.url() with: default codeId: 117, data: Instagram
// lookup tries to find "Instagram" if not found added with parentUd = 117
// result:
url:[  {
    typeId: 165,
    value: "em-cultuur"
  }
]
```
