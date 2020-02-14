/**
 * an structured object
 */

const Field = require('./field').Field;
const _ = require('lodash');
const ErrorFieldNotAllowed = require('error-types').ErrorFieldNotAllowed;
const FieldText = require('./field-text').FieldText;
const FieldGuid = require('./field-text').FieldTextGuid;

class FieldObject extends Field {

  constructor(options = {}){
    super(options);
    // this should be set by the child object. Defines the parentId for new records
    this.baseTypeId = undefined;
    // this function is called when type has to be translated to typdId
    this._lookup = options.lookup;
    this.lookupFunctionName = options.lookupFunctionName ? options.lookupFunctionName : false;
    this.emptyValueAllowed = false;
    // this._name = 'object';
    // add here the fieldName: fieldDefinition
    this._fields = options.fields !== undefined ? options.fields : {
      type: new FieldText({emptyAllow:  this.emptyAllow }),          // the name of the code
      type_: new FieldText({emptyAllow:  this.emptyAllow }),         // the name of the code but never used as lookup
      typeId: new FieldGuid({emptyAllow:  this.emptyAllow }),        // the id, overrules the type
      typeGuid: new FieldGuid({emptyAllow:  this.emptyAllow }),      // the id, overrules the type

      fieldTypeId:  new FieldGuid({emptyAllow:  this.emptyAllow }),  // if set: set the code.typeId
      fieldTypeGuid: new FieldGuid({emptyAllow:  this.emptyAllow }), // or find the code.guid => typeId

      parentId: new FieldGuid({emptyAllow:  this.emptyAllow }),      // the id, overrules the type
      parentGuid: new FieldGuid({emptyAllow:  this.emptyAllow }),    // the id, overrules the type
      parentText: new FieldText({emptyAllow:  this.emptyAllow }),    // the id, overrules the type
      parentTypeId: new FieldGuid({emptyAllow:  this.emptyAllow }),  // the id, overrules the type

      _parent: new FieldText({emptyAllow:  this.emptyAllow }),       // where is this record linked to
      _source: new FieldText({emptyAllow:  this.emptyAllow }),       // not used but should be!
    };

    this._removeEmpty = options.removeEmpty !== undefined ? options.removeEmpty : true;
  }

  get lookup() {
    return this._lookup;
  }
  /**
   *
   * @param fieldName
   * @param data
   * @param logger
   */
  validate(fieldName, data, logger = false) {
    let isValid = true;
    for (let name in data) {
      if (!data.hasOwnProperty(name)) { continue }
      let fieldDefinition = this._fields[name];
      let subName = fieldName + '.' + name;
      if (fieldDefinition === undefined) {
        this.log(logger, 'error', subName, 'field does not exist');
        isValid = false;
      } else {
        isValid = isValid && fieldDefinition.validate(subName, data[name], logger )
      }
    }
    return isValid;
  }

  isEmpty(data) {
    if (data !== undefined && _.isObject(data)) {
      for (let key in this._fields) {
        if (!this._fields.hasOwnProperty(key)) {
          continue
        }
        if (!this._fields[key].isEmpty(data[key])) {
          return false;
        }
      }
    }
    return true;
  }

  copyFieldsToResult(result, data, skip = []) {
    for (let key in data) {
      if (!data.hasOwnProperty(key)) { continue }
      if (result[key] === undefined && skip.indexOf(key) < 0) {
        // only overwrite if it does not exist
        if (this._removeEmpty === false || data[key] !== undefined )  {
          result[key] = data[key]
        }
      }
    }
    // remove the skipped fields
    for (let l = 0; l < skip.length; l++) {
      delete result[skip[l]];
    }
    return result;
  }

  // async lookup(value, baseType, fields, data, logger, defaults = false) {
  //   // TODO adust to class
  //   // if (this._lookup) {
  //   //   return await this._lookup(value, baseType, fields, data, defaults);
  //   // }
  //   return defaults;
  // }
  /**
   * returns the new definition from the data
   * @param data
   */
  remapFields(data) {
    let currentFields = {};
    for (let key in data) {
      if (!data.hasOwnProperty(key)) { continue }
      currentFields[key] = this._fields[key];
    }
    return currentFields;
  }
  /**
   * just process all keys individual
   *
   * @param fieldName
   * @param fields the field parsers
   * @param data the data given
   */
  async processKeys(fieldName, fields, data, logger) {
    // valid object: fields
    let result = {};
    for (let name in fields) {
      if (!fields.hasOwnProperty(name)) {
        continue
      }
      let subName = fieldName + '.' + name;
      try {
        let fieldDefinition = fields[name];
        result[name] = await fieldDefinition.convert(subName, data[name], logger);
        if (result[name] === undefined) { // remove keys that are empty
          delete result[name];
        }
      } catch (e) {
        this.log(logger,'error', subName, e.message);
      }
    }
    // clean the type definition
    if ((this.emptyValueAllowed || result.value !== undefined || result.type !== undefined || result.type_ !== undefined) &&
      ! (fields['typeId'] && ! fields['typeId'].isEmpty(result['typeId']))) {

      if (this.lookup && this.lookupFunctionName && this.lookup[this.lookupFunctionName]) {
        // create / lookup the code. Needs id, guid or text for code. If not found needs also groupId, fieldTypeId.
        // translate into a new code that can be found
        let codeDef = {
          // the code we want to find. Text is store in the result.type
          id: data.typeId,
          guid: data.typeGuid,
//          text: data.type,
          fieldTypeId: data.fieldTypeId,
          fieldTypeGuid: data.fieldTypeGuid,

          // the data to create the parent if it does not exist
          parentIdDefault: this.baseTypeId,
          parentId: data.parentId,
          parentGuid: data.parentGuid,
          parentText: data.parentText,
        };
        if (data.type_) {
          codeDef.textNoFind = data.type_;
        } else {
          codeDef.text = data.type;
        }
        result.typeId = await this.lookup[this.lookupFunctionName](fieldName, codeDef); //

        // result.type, this.baseTypeId, data);
      } else if (result.type !== undefined) {
        this.log(logger, 'error', fieldName, `no lookup function or lookupFunction name not defined for class "${this.constructor.name}" to translate type to typeId`);
      } else {
        // use the root code as typeId
        result.typeId = this.baseTypeId;
      }
    }
    result = _.omit(result, ['typeGuid', 'type', 'type_', 'parentId', 'parentGuid', 'parentText', 'parentTypeId']);
    // delete result.type;

    return Promise.resolve(result);
  }

  /**
   * adjust the object. if error or warnings use the logger
   * @param object
   * @param logger
   * @param options
   */
  convert(fieldName, data, logger = false) {
    let isValid = [];
    let fields = {};
    // create the list of fields to process
    for (let name in data) {
      if (!data.hasOwnProperty(name)) { continue  }
      let fieldDefinition = this._fields[name];
      let subName = fieldName + '.' + name;
      if (fieldDefinition === undefined) {
        this.log(logger, 'error', subName, 'field does not exist');
        isValid.push(name);
      } else if (this._removeEmpty === false || !fieldDefinition.isEmpty(data[name])) {
        // empty fields are removed
        fields[name] = this._fields[name];
      }
    }
    if (isValid.length > 0) {
      return Promise.reject(new ErrorFieldNotAllowed(isValid));
    } else if (this._removeEmpty && _.isEmpty(fields)) {
      return Promise.resolve({});
    } else {
      // check the emptyAllow isn't set for all
      for (let key in fields) {
        if (!fields.hasOwnProperty(key)) { continue }
        if (fields[key].emptyAllow === undefined || fields[key].emptyAllow === false) {
          return this.processKeys(`${fieldName}`, fields, data, logger).then((rec) => {
            return Promise.resolve(rec)
          })
        }
      }
      return Promise.resolve({});
    }
  }
}

module.exports.FieldObject = FieldObject;
