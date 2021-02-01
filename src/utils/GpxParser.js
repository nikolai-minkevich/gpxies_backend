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
  getJson() {
    return this.jsonObj;
  }
  generateHeader(creator = 'Gpxies.ru', date = new Date().toISOString(), title = 'New track ' + date, distance = '0') {
    this.jsonObj.gpx.attr.creator = creator;
    this.jsonObj.gpx.metadata.link.attr.href = 'https://gpxies.ru';
    this.jsonObj.gpx.metadata.link.text = 'Gpxies.ru';
    this.jsonObj.gpx.metadata.time = date;

    if (!Array.isArray(this.jsonObj.gpx.trk)) {
      this.jsonObj.gpx.trk = new Array(this.jsonObj.gpx.trk);
    }
    this.jsonObj.gpx.trk.forEach((trk) => {
      trk.name = title;
      trk.extensions['gpxtrkx:TrackStatsExtension']['gpxtrkx:Distance'] = distance;
      delete trk.extensions['gpxx:TrackExtension'];
      if (!Array.isArray(trk.trkseg)) {
        trk.trkseg = new Array(trk.trkseg);
      }
      trk.trkseg.forEach((trkpt) => {
        delete trkpt.time;
        delete trkpt.ele;
        delete trkpt.fix;
        delete trkpt.sat;
      });
    });
    return this.jsonObj;
  }
}

module.exports = GpxParser;
