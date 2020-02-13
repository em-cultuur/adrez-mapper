/*
 *
 */

const FieldComposed = require('./field-composed').FieldComposed;
const FieldText = require('./field-text').FieldText;

class FieldMemo extends FieldComposed {
  constructor(options = {}) {
    super(options);
    this.lookupFunctionName = 'memo';

    this.baseTypeId = options.baseTypeId !== undefined ? options.baseTypeId : 400;

    this._fields.description = new FieldText()     ; // force to international
  }
}

module.exports.FieldMemo = FieldMemo;
