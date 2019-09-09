#adrez-mapp
```sh
npm install https://github.com/toxus/adrez-mapper.git --save
```
Convert a raw address record into the workable version for the AdreZ api

````javascript
const Record = require('adrez-mapper').Record;
const Logger = require('logger');

let logger = new Logger({toConsole: false});
const findInCodes = async function(value, baseType, fields, data) {
  // lookup the value to translate it into a id
  return Promise.resolve(12345);  
}
const options = {
  // the default lookup
  lookup : findInCodes,
  // change the look on a per type basis
  email: { lookup : findInEmail }
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

## lookup function

The folling **baseType** can be expected:
- contact - value is **text** of type, result is the **typeId**
- telephone - value is **text**, result is the **id**
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



(c) MIT 2019 Toxus