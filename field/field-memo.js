/*
 *
 */

const FieldComposed = require('./field-composed').FieldComposed;
const FieldText = require('./field-text').FieldText;

class FieldMemo extends FieldComposed {
  constructor(options = {}) {
    super(options);
    this._fields.description = new FieldText()     ; // force to international
  }
}

module.exports.FieldMemo = FieldMemo;