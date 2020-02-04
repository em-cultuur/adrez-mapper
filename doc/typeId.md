[Home](../README.md)

## type/typeId and value
The type/typeId add automatically the needed code to the code table. The rules to translate the definition
into the final required typeId.
- if the **typeId** is given, nothing is changed and this value is stored
- if the **value** is given (not the url, Facebook, mobile, telephone, etc), this value is stored and the typeId is calulated
from the type and the default subtype (telephone, url, email, etc)
- if a predefined type (url, Facebook, etc) is given the **typeId** is set by this type. If no **typeId** is available the **type** is used. If
the **type** is ommited the property name of the filter is used.



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

3. use a predefined field type
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

4. translate from url
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


5. translate from url with no typeId
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
