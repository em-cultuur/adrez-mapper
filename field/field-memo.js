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

    // if field is set, save it all
    this._fields.description = new FieldText({emptyAllow: false});
  }
}

module.exports.FieldMemo = FieldMemo;
