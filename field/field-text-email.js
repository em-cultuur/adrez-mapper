/*
 *
 */

const FieldText = require('./field-text').FieldText;
const _ = require('lodash');
const ErrorNotValid = require('./field').ErrorNotValid;

let ERROR_CODE = '#import'

class FieldTextEmail extends FieldText {

  constructor(options = {}){
    super(options);
    if (options.ERROR_CODE) {
      ERROR_CODE = options.ERROR_CODE;
    }
    this._name = 'email';
  }

   adjust(fieldName, email, logger = false) {
    let errMsg = '';
    if (email === undefined || email.length === 0) {
      return Promise.resolve(undefined);
    }

    email = _.replace(email, /</g, '');
    email = _.replace(email, />/g, '');
    email = _.toLower(email);
    email = email.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    email = _.replace(email, /\n/g, '');
    email = _.replace(email, /\t/g, '');
    email = _.replace(email, /\r/g, '');
    email = _.replace(email, / /g, '');
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(email)) {
      errMsg = ' ' + ERROR_CODE;
      this.log(logger, 'warn', fieldName, `the email address ${email} is not valid`);
    }
    return Promise.resolve(email + errMsg)
  }

  /**
   * we must first clear the errors before validating
   *
   * @param fieldName
   * @param data
   * @param logger
   * @return {*}
   */
  convert(fieldName, data, logger) {
    return this.adjust(fieldName, data, logger).then( (rec) => {
      if (this.validate(fieldName, rec, logger)) {
        return Promise.resolve(rec)
      }
      this.log(logger, 'warn', fieldName, `${rec} is not a valid email`)
      return Promise.resolve('' )
    })
  }
}

module.exports.FieldTextEmail = FieldTextEmail;
