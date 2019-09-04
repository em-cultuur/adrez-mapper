#adrez-mapp
```sh
npm install https://github.com/toxus/adrez-mapper.git --save
```
Convert a raw address record into the workable version for the AdreZ api

````javascript
const Record = require('adrez-mapper').Record;
const Logger = require('logger');

let logger = new Logger({toConsole: false});
const findInCodes = function(value, baseType, fields, data) {
  // lookup the value to translate it into a id
  return 12345;  
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


(c) MIT 2019 Toxus