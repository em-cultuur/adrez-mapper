/**
 * parses the fullname into it's counter parst
 */

const parser = require('parse-full-name').parseFullName;
const parserConfig = require('parse-full-name').changeWords;
const parserWords = require('parse-full-name').words;
const Config = require('config');

class ParseFullName {
  constructor(options = {}) {
    if (Config.has('Parser.suffix')) {
      parserConfig('suffix', Config.get('Parser.suffix'));
    } else {
      parserConfig('suffix', options.suffix ? options.suffix : ['ba', 'bsc', 'ma', 'msc', 'llb', 'llm', 'a.i.']);
    }
    if (Config.has('Parser.prefix')) {
      parserConfig('prefix', Config.get('Parser.prefix'))
    } else {
      parserConfig('prefix', options.prefix ? options.prefix :
        ['d\'', 'de', 'der', 'den', 'Di', 'du', 'in', 'la', 'le', 'op', '\'t', 'te', 'ten', 'ter', 'v.d.', 'v/d', 'van', 'Vande', 'Vanden', 'Vander', 'von', 'voor']);
    }
    if (Config.has('Parser.titles')) {
      parserConfig('titles', Config.get('Parser.titles'));
    } else {
      parserConfig('titles', options.titles ? options.titles : ['dr.', 'drs.', 'baron', 'adjudant', 'abt', 'barones',
        'Broeder', 'deken', 'ing.', 'ir.', 'Jhr.', 'Jkvr.', 'kaptein', 'kol', 'lkol b.d.', 'lt.', 'kol.', 'luitenant', 'zee', 'luitenant-ko', 'Maj. b.d.',
        'majoor', 'mr.', 'Pater', 'prof.', 'ritm.', 'sergeant', 'majoor', 'Zr.', 'Zuster', 'familie', 'heer', 'mevrouw'])
    }
 }

  get suffix() {
    return parserWords('suffix')
  }
  set suffix(value) {
    parserConfig('suffix', value)
  }

  get prefix() {
    return parserWords('prefix')
  }
  set prefix(value) {
    parserConfig('prefix', value)
  }
  get title() {
    return parserWords('title')
  }
  set title(value) {
    parserConfig('title', value)
  }

  analyse(name) {
    return parser(name)
  }
}

module.exports.ParseFullName = ParseFullName;
