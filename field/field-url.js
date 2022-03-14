/*
 *
 */

const FieldComposed = require('./field-composed').FieldComposed;
const FieldTextUrl = require('./field-text-url').FieldTextUrl;
const FieldText = require('./field-text').FieldText;

class FieldUrl extends FieldComposed {
  constructor(options = {}) {
    super(options);
    this._skipField = ['url', 'href', 'hostPath', 'origin'];
    this.baseTypeId = options.baseType !== undefined ? options.baseType: 117;
    this.lookupFunctionName = 'url';
    this._fields.url = new FieldTextUrl({part: 'href'});
    this._fields.hostPath = new FieldTextUrl({part: 'hostPath'});
    this._fields.origin = new FieldTextUrl({part: 'origin'});

    // convert the auto loaded urls in regex
    // textRegEx is the part that holds the name of the account
    this._urls = {
     twitter: {
        url: new RegExp('twitter\.com'),
        typeId: 117,
        name: 'twitter',
        textRegEx: new RegExp('(?:https?:\\/\\/)?(?:www\\.)?twitter\\.com\\/(?:(?:\\w)*#!\\/)?(?:[\\w\\-]*\\/)*([\\w\\-\\.]*)')
     },
     facebook: {
       url: new RegExp('facebook\.com'),
       typeId: 117,
       name: 'facebook',
       textRegEx: new RegExp('(?:https?:\\/\\/)?(?:www\\.)?facebook\\.com\\/(?:(?:\\w)*#!\\/)?(?:pages\\/)?(?:[\\w\\-]*\\/)*([\\w\\-\\.]*)')
     },
     linkedin: {
       url: new RegExp('linkedin\.com\/'),
       typeId: 117,
       name: 'linkedin',
       // textRegEx: new RegExp('(?:https?:\\/\\/)?(?:www\\.)?linkedin.com(\\w+:{0,1}\\w*@)?(\\S+)(:([0-9])+)?(\\/|\\/([\\w#!:.?+=&%@!\\-\\/]))?')
       textRegEx: new RegExp('(?:https?:\\/\\/)?(?:www\\.)?linkedin\\.com\\/(?:(?:\\w)*#!\\/)?(?:in\\/)?(?:[\\w\\-]*\\/)*([\\w\\-\\.]*)')
     }
    };
    if (options.urls) {
      for (let name in options.urls) {
        if (!options.urls.hasOwnProperty(name)) { continue }
        try {
          this._urls[name] = {
            url: new RegExp(options.urls[name].url),
            textRegEx: options.urls[name].textRegEx ? new RegExp(options.urls[name].textRegEx) : false
          };
          if (options.urls[name].typeId) {
            this._urls[name].typeId = options.urls[name].typeId
          } else if (options.urls[name].type) {
            this._urls[name].type = options.urls[name].type;
          } else {
            this._urls[name].type = name;
          }
        } catch (e) {
          console.error('[url config]', e.message, 'link skipped', options.urls[name].url);
          this.log(options.logger, 'error', options.urls[name].name, e.message);
        }
      }
    }
    for (let name in this._urls) {
      if (!this._urls.hasOwnProperty(name)) { continue }
      this._fields[name] = new FieldText();
      this._skipField.push(name)
    }
    this.addStoreGroup('value');
    this.addStoreGroup('url');
  }


  /**
   * just process all keys individual
   *
   * @param fieldName
   * @param fields the field parsers
   * @param data the data given
   * @param logger Class where to store the errors
   */
  async processKeys(fieldName, fields, data, logger) {
    let result = {};

    if (fields.value === undefined) {  // value overrules all
      let postScan = true;
      // try the user defined fields first (Like Facebook)
      for (let name in this._urls) {
        if (!this._urls.hasOwnProperty(name)) { continue }
        if (data[name]) {
          data.value = data[name];
          postScan = false;
          data.typeId = await this.lookup.urlSubType(fieldName, this._urls[name].name, this._urls[name].typeId);
        }
      }
      // if value wasn't set by the userType try the predefined fields
      if (data.value === undefined) {
        if (fields.url) {
          data.value = await this._fields.url.convert(fieldName, data.url, logger)
        } else if (fields.href) {
          data.value = await this._fields.href.convert(fieldName, data.href, logger)
          postScan = false;
        } else if (fields.hostPath) {
          data.value = await this._fields.hostPath.convert(fieldName, data.hostPath, logger)
        } else if (fields.origin) {
          data.value = await this._fields.origin.convert(fieldName, data.origin, logger)
        }
      }

      // try to find what type the url is if we have value
      if (data.value && postScan) {
        // find the type of the url automatically if the user did not force it
        for (let name in this._urls) {
          if (!this._urls.hasOwnProperty(name)) {
            continue
          }
          if (data.value.match(this._urls[name].url)) {
            // found the field, so set the type or typeId
            // default is typeId, but if not found, use the type
            // -- the typeId can be configured per customer
            data.typeId = await this.lookup.urlSubType(fieldName, this._urls[name].name, this._urls[name].typeId);
            if (this._urls[name].textRegEx && data.typeId !== this._urls[name].typeId) {
              // only if there is a reg ex and we did not get the default type
              // parse the url
              let v = data.value.match(this._urls[name].textRegEx);
              if (v !== null && v.length > 1) {
                data.value = v[1]
              }
            }
            break;
          }
        }
      }
    }
    this.copyFieldsToResult(result, data, this._skipFields);
    let cFields = this.remapFields(result);
    return super.processKeys(fieldName, cFields, result, logger);

    // let resultData = await super.processKeys(fieldName, cFields, result, logger);
    // if (resultData.value && resultData.value.length ) {
    //   return resultData
    // }
    // return {}
  }
}

module.exports.FieldUrl = FieldUrl;
