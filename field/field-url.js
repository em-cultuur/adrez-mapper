/*
 *
 */

const FieldComposed = require('./field-composed').FieldComposed;
const FieldTextUrl = require('./field-text-url').FieldTextUrl;

class FieldUrl extends FieldComposed {
  constructor(options = {}) {
    super(options);
    this._fields.url = new FieldTextUrl({part: 'href'});
    // this._fields.href = new FieldTextUrl({part: 'href'});
    this._fields.hostPath = new FieldTextUrl({part: 'hostPath'});
    this._fields.origin = new FieldTextUrl({part: 'origin'});

    // convert the auto loaded urls in regex
    this._urls = {
     facebook: { url: 'facebook\.com', typeId: 141 },
     linkedIn: { url: 'www\.linkedin\.com\/in\/', typeId: 142 },
     twitter: {url: 'twitter\.com', typeId: 143}
    };
    if (options.urls) {
      for (let l = 0; l < options.urls.length; l++) {
        try {
          this._urls[options.urls[l].name] = {
            url: new RegExp(options.urls[l].url),
            typeId: options. urls[l].typeId
          };
        } catch (e) {
          console.error('[url config]', e.message, 'link skipped', options.urls[l].url);
          this.log(options.logger, 'error', options.urls[l].name, e.message);
        }
      }
    }
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
      if (fields.url) {
        data.value = await this._fields.url.convert(fieldName, data.url, logger)
      } else if (fields.href) {
        data.value = await this._fields.href.convert(fieldName, data.href, logger)
      } else if (fields.hostPath) {
        data.value = await this._fields.hostPath.convert(fieldName, data.hostPath, logger)
      } else if (fields.origin) {
        data.value = await this._fields.origin.convert(fieldName, data.origin, logger)
      }
    }
    if (data.value && data.typeId === undefined) {
      // find the type of the url automatically if the user did not force it
      for (let name in this._urls) {
        if (! this._urls.hasOwnProperty(name)){ continue }
        if (data.value.match(this._urls[name].url)) {
          // default is typeId, but if not found, use the type
          if (this._urls[name].typeId) {
            data.typeId = this._urls[name].typeId;
          } else if (this._urls[name].type) {
            data.type = this._urls[name].type;
          }
          break;
        }
      }
    }
    this.copyFieldsToResult(result, data, ['url', 'href', 'hostPath', 'origin']);
    let cFields = this.remapFields(result);
    return super.processKeys(fieldName, cFields, result, logger);
  }
}

module.exports.FieldUrl = FieldUrl;
