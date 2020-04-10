#adrez-mapp
## class Lookup

The extension library for the mapper

### async composed(fieldName, value, defaults, data)
call when a compose object is analysed

### async telephone(fieldName, value, defaults, data) 
called for every telephone number 

### async contact(fieldName, value, defaults, data)


### async email(fieldName, value, defaults, data)
 
### async memo(fieldName, value, defaults, data) 

### async extra(fieldName, value, defaults, data) 

###  async code(fieldName, value, defaults, data) 
  
### async gender(fieldName, value, defaults, data) 
Called to define the gender of the current contact. Value is the typeId of the record.
Other information can be found in the data definition.

### async zipcode2Country(fieldname, value, defaults, data) 
**value** is the zipcode. The result is the possible country if the format is known. 
If not, return the **defaults**

### async zipcode(fieldName, streetObj, defaults, data) 
Looks up the zipcode given the information available. **streetObj** is 
**{ street, number, city, countryId}**

### async country(fieldname, country, defaults, data) 
Tries to find the country id of the name. **country** is the string.

### async countryStreetNumberRight(fieldName, countryId, defaults, data) 
This function defines how the street is analysed. In some parts of the world the number is placed
on the beginning, on other parts is on the end. The **countryId** it the id of the country.
Should return **true** if the number is on the right. 

### async street(fieldName, locationObj, defaults, data) 
Looks up the name of the street. **locationObj** is a structure:
**{ zipcode, number, countryId}**

## definition
```javascript
 let def = {
        id: data.typeId,
        guid: data.typeGuid,        
        fieldTypeId: data.fieldTypeId,
        fieldTypeGuid: data.fieldTypeGuid,
        
        // the data to create the parent if it does not exist
        parentIdDefault: this.baseTypeId,
        parentId: data.parentId,
        parentGuid: data.parentGuid,
        parentText: data.parentText,
        data: data
    };
    if (data.type_) {
      codeDef.textNoFind = data.type_;
    } else {
      codeDef.text = data.type;
    }
```

### campaign(fieldName, def)
Look up for the type of campaign

### campaignAction(fieldName, def)
Lookup for the action

### campaignGroup(fieldName, def)
Lookup for the definition

### campaignContact(field, def)
Lookup for the code in the campaign => contact
