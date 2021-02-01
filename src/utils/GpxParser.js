const x2jParser = require('fast-xml-parser');
const j2xParser = require('fast-xml-parser').j2xParser;
const he = require('he');

class GpxParser {
  constructor() {
    this.optionsGPX2JSON = {
      attributeNamePrefix: '',
      attrNodeName: 'attr', //default is 'false'
      textNodeName: '#text',
      ignoreAttributes: false,
      ignoreNameSpace: false,
      allowBooleanAttributes: false,
      parseNodeValue: true,
      parseAttributeValue: false,
      trimValues: true,
      cdataTagName: '__cdata', //default is 'false'
      cdataPositionChar: '\\c',
      parseTrueNumberOnly: false,
      arrayMode: false, //"strict"
      attrValueProcessor: (val, attrName) => he.decode(val, { isAttributeValue: true }), //default is a=>a
      tagValueProcessor: (val, tagName) => he.decode(val), //default is a=>a
      stopNodes: ['parse-me-as-string'],
    };
    this.optionsJSON2GPX = {
      attributeNamePrefix: '',
      attrNodeName: 'attr', //default is false
      textNodeName: '#text',
      ignoreAttributes: false,
      cdataTagName: '__cdata', //default is false
      cdataPositionChar: '\\c',
      format: false,
      indentBy: '  ',
      supressEmptyNode: false,
      //tagValueProcessor: a=> he.encode(a, { useNamedReferences: true}),// default is a=>a
      //attrValueProcessor: a=> he.encode(a, {isAttributeValue: isAttribute, useNamedReferences: true})// default is a=>a
    };
  }
  loadGpx(data) {
    if (x2jParser.validate(data) === true) {
      this.jsonObj = x2jParser.parse(data, this.optionsGPX2JSON);
      return this.jsonObj;
    }
    return false;
  }
  createXmlGpx() {
    const j2xParser = new j2xParser(this.optionsJSON2GPX);
    const xml = j2xParser.parse(this.jsonObj);
    return xml;
  }
}

module.exports = GpxParser;
