/**
 * Possible layouts
 *   in : http://www.em-cultuur.com:81/test?x=2
 *   out:
 *     - url: www.em-cultuur.com:81
 *     - href: http://www.em-cultuur.com:81/test?x=2
 *     - hostPath: www.em-cultuur.com:81/test?x=2
 *     - origin: www.em-cultuur.com
 *
 * @type {FieldText}
 */
const FieldText = require('./field-text').FieldText;
const URL = require('url');

class FieldTextUrl extends FieldText {
  constructor(options = {}){
    super(options);
    this._part = options.part === undefined ? 'href' : options.part;
    this._name = 'url';
  }


  adjust(fieldName, dataUrl, logger = false) {
    if (dataUrl) {
      let parsed = URL.parse(dataUrl);
      let result;
      switch (this._part) {
        case 'href':
          result = parsed.href;
          if (!parsed.protocol) {
            parsed.protocol = '';
          }
          if (parsed.protocol.length && result.substr(0, parsed.protocol.length) === parsed.protocol) {
            result = result.substr(parsed.protocol.length + 2);
          }
          // remove the irritating / on the end
          if (result[result.length - 1] === '/') {
            result = result.substr(0, result.length -1)
          }
          break;
        case 'hostPath':
          result = parsed.host + parsed.path;
          break;
        case 'origin':
          result = parsed.hostname;
          break;
        case 'url':
        default: {
          result = parsed.host;
        }
      }
      return Promise.resolve(result)
    } else {
      return Promise.resolve(undefined);
    }

  }

  /**
   * we must first clear the errors before validating
   *
   * @param fieldName
   * @param data
   * @param logger
   * @return {*}
   */
  async convert(fieldName, data, logger) {
    return this.adjust(fieldName, data, logger).then( (rec) => {
      if (this.validate(fieldName, rec, logger)) {
        return Promise.resolve(rec)
      }
      this.log(logger, 'error', fieldName, `${rec} is not a valid url`);
      return Promise.resolve('' )
    })
  }
}

module.exports.FieldTextUrl = FieldTextUrl;
