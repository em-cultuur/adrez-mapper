/**
 * an structured object
 */

const Field = require('./field').Field;
const _ = require('lodash');
const ErrorFieldNotAllowed = require('error-types').ErrorFieldNotAllowed;
const FieldText = require('./field-text').FieldText;
const FieldGuid = require('./field-text').FieldTextGuid;
const FieldTextBoolean = require('./field-text-boolean').FieldTextBoolean;
const FieldTextSet = require('./field-text-set').FieldTextSet;
const Lookup = require('../lib/lookup')

class FieldObject extends Field {

  /**
   *
   * @param options
   *   - needMode if false the mode is copied anyway, otherwise it's not important for the empty check
   */
  constructor(options = {}){
    super(options);
    // this should be set by the child object. Defines the parentId for new records
    this.baseTypeId = undefined;
    // this function is called when type has to be translated to typdId
    this._lookup = options.hasOwnProperty('lookup') ? options.lookup : new Lookup();
    this.lookupFunctionName = options.lookupFunctionName ? options.lookupFunctionName : false;
    this.emptyValueAllowed = false;
    // this._name = 'object';
    // add here the fieldName: fieldDefinition
    this._fields = options.fields !== undefined ? options.fields : {
      type: new FieldText({emptyAllow:  this.emptyAllow }),          // the name of the code
      type_: new FieldText({emptyAllow:  this.emptyAllow }),         // the name of the code but never used as lookup
      typeId: new FieldGuid({emptyAllow:  this.emptyAllow }),        // the id, overrules the type
      typeGuid: new FieldGuid({emptyAllow:  this.emptyAllow }),      // the id, overrules the type
      typeIsDefault: new FieldGuid({emptyAllow: this.emptyAllow}),   // set in the code table it's default
      typeInsertOnly: new FieldTextBoolean({emptyValueAllowed: this.emptyValueAllowed}),
      // fix: _mode is "NEVER" a reason to store the record
      _mode: new FieldTextSet({emptyAllow: options.hasOwnProperty('needMode') ? options.needMode: true , values:{
          none: 0,
          add: 1, create: 1, insert: 1,
          update: 2, modify: 2,
          delete: 4, remove: 4,
          skip: 8,      // if not found do nothing and no error
          inherit: 16,  // if code / location has no mode use the one of the contact parent
          kill: 32,     // if code found it should be delete even if delete is set for the code
          blocked: 64,  // this element and any child are not update / added / deleted
          force: 128,   // even if all standard fields are empty, leave the record
        }
      }),
      // if set to true the code will not be delete by the sync

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
      if (data._mode && data._mode & 128 === 128) {
        return false;
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
   * to set the parameters for the code definition
   * @param definition
   * @param data
   */
  buildCodeDef(definition, data) {

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
        result[name] = await fieldDefinition.convert(subName, data[name], logger, data);
        if (result[name] === undefined) { // remove keys that are empty
          delete result[name];
        }
      } catch (e) {
        this.log(logger,'error', subName, e.message);
      }
    }
    // clean the type definition
    if ((this.emptyValueAllowed || result.value !== undefined || result.type !== undefined || result.type_ !== undefined) &&
       ! result.typeId) {
      // this blocks the missing typeId from getting the default value
      // ! (fields['typeId'] && ! fields['typeId'].isEmpty(result['typeId']))) {
      result.typeId = await this.lookupCode(data, this.lookupFunctionName, 'type', '', this.baseTypeId, logger)
    }
    result = _.omit(result, ['typeGuid', 'type', 'type_', 'parentId', 'parentGuid', 'parentText', 'parentTypeId']);
    if (Object.keys(result).length === 1 && result.hasOwnProperty('_mode')) {
      return {}
    }
    return result;
  }

  async lookupCode(data, functionName, fieldName = 'type', parentPrefix = '', baseTypeId, logger) {
    if (this.lookup && this.lookupFunctionName && this.lookup[this.lookupFunctionName]) {
      // create / lookup the code. Needs id, guid or text for code. If not found needs also groupId, fieldTypeId.
      // translate into a new code that can be found
      let codeDef = {
        // the code we want to find. Text is store in the result.type
        id: data[`${fieldName}Id`],
        guid: data[`${fieldName}Guid`],
        fieldTypeId: data[`field${fieldName.substring(0,1).toUpperCase() + fieldName.substring(1)}Id`],
        fieldTypeGuid: data[`field${fieldName.substring(0,1).toUpperCase() + fieldName.substring(1)}Guid`],
        fieldTypeInsertOnly: data.hasOwnProperty(`${fieldName}InsertOnly`) ? !!data[`${fieldName}InsertOnly`] : false,

        // the data to create the parent if it does not exist
        parentIdDefault: this.baseTypeId,
        parentId: data[`${parentPrefix}parentId`],
        parentGuid: data[`${parentPrefix}parentGuid`],
        parentText: data[`${parentPrefix}parentText`],
        data: data
      };
      if (data.type_) {
        codeDef.textNoFind = data.type_;
      } else {
        codeDef.text = data[fieldName];
      }
      this.buildCodeDef(codeDef, data);

      return await this.lookup[functionName](fieldName, codeDef); //
    // } else if (baseTypeId !== undefined) {
    //   this.log(logger, 'error', fieldName, `no lookup function or lookupFunction ${functionName} name not defined for class "${this.constructor.name}" to translate type to typeId`);
    } else {
      return baseTypeId
    }
  }
  /**
   * adjust the object. if error or warnings use the logger
   * @param object
   * @param logger
   * @param options
   */
  async convert(fieldName, data, logger = false, parent = false) {
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
      return {};
    } else {
      // check the emptyAllow isn't set for all
      for (let key in fields) {
        if (!fields.hasOwnProperty(key)) { continue }
        if (fields[key].emptyAllow === undefined || fields[key].emptyAllow === false) {
          return await this.processKeys(`${fieldName}`, fields, data, logger);
          // .then((rec) => {
          //   return Promise.resolve(rec)
          // })
        }
      }
      return {};
    }
  }
}

module.exports.FieldObject = FieldObject;
