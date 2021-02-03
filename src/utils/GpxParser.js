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
    const jsonToGpxParser = new j2xParser(this.optionsJSON2GPX);
    const xml = jsonToGpxParser.parse(this.jsonObj);
    return xml;
  }
  getJson() {
    return this.jsonObj;
  }
  getMetadata() {
    return { distance: this.distance, points: this.points };
  }
  prepare(creator = 'Gpxies.ru', date = new Date().toISOString(), title = 'New track ' + date) {
    // Header
    this.jsonObj.gpx.attr.creator = creator;
    if (this.jsonObj.gpx.metadata){
       this.jsonObj.gpx.metadata.link.attr.href = 'https://gpxies.ru';
    this.jsonObj.gpx.metadata.link.text = 'Gpxies.ru';
    this.jsonObj.gpx.metadata.time = date;
    }
    // trk -> trkseg -> trkpt
    let distance = 0;
    let startLat = null;
    let startLon = null;
    let points = 0;
    if (!Array.isArray(this.jsonObj.gpx.trk)) {
      this.jsonObj.gpx.trk = new Array(this.jsonObj.gpx.trk);
    }
    this.jsonObj.gpx.trk.forEach((trk) => {
      trk.name = title;
      if (trk.extensions && trk.extensions['gpxx:TrackExtension']) {
        delete trk.extensions['gpxx:TrackExtension'];
      } 

      if (!Array.isArray(trk.trkseg)) {
        trk.trkseg = new Array(trk.trkseg);
      }
      trk.trkseg.forEach((trkseg) => {
        if (!Array.isArray(trkseg.trkpt)) {
          trkseg.trkpt = new Array(trkseg.trkpt);
        }
        trkseg.trkpt.forEach((trkpt) => {
          Object.keys(trkpt).map((node) => {
            // All other attributes does not matter
            if (node !== 'attr') {
              delete trkpt[node];
            } else {
              // calculate actual distance
              if (startLat == null) {
                startLat = trkpt.attr.lat;
              }
              if (startLon == null) {
                startLon = trkpt.attr.lon;
              }
              distance += this.calculateDistance(trkpt.attr.lat, trkpt.attr.lon, startLat, startLon);
              startLat = trkpt.attr.lat;
              startLon = trkpt.attr.lon;
            }
            points += 1;
          });
        });
      });
      if (trk.extensions && trk.extensions['gpxx:TrackStatsExtension']) {
        trk.extensions['gpxtrkx:TrackStatsExtension']['gpxtrkx:Distance'] = distance;
      }
      
      this.distance = distance;
      this.points = points;
    });
    return this.jsonObj;
  }
  // It is not a trivial task
  // Good explanation: https://medium.com/@congyuzhou/%D1%80%D0%B0%D1%81%D1%81%D1%82%D0%BE%D1%8F%D0%BD%D0%B8%D0%B5-%D0%BC%D0%B5%D0%B6%D0%B4%D1%83-%D0%B4%D0%B2%D1%83%D0%BC%D1%8F-%D1%82%D0%BE%D1%87%D0%BA%D0%B0%D0%BC%D0%B8-%D0%BD%D0%B0-%D0%BF%D0%BE%D0%B2%D0%B5%D1%80%D1%85%D0%BD%D0%BE%D1%81%D1%82%D0%B8-%D0%B7%D0%B5%D0%BC%D0%BB%D0%B8-a398352bfbde
  calculateDistance(lat1, lon1, lat2, lon2) {
    if (lat1 == lat2 && lon1 == lon2) return 0;
    // Average radius of Earth
    const r = 6371000;
    const f1 = this.degreeToRadian(lat1);
    const f2 = this.degreeToRadian(lat2);
    const l1 = this.degreeToRadian(lon1);
    const l2 = this.degreeToRadian(lon2);
    return (
      2 *
      r *
      Math.asin(Math.sqrt(Math.pow(Math.sin((f2 - f1) / 2), 2) + Math.cos(f1) * Math.cos(f2) * Math.pow(Math.sin((l2 - l1) / 2), 2)))
    );
  }
  // Формула перевода проста — градусы * Пи/180.
  // Если градусы указываются в форме «градусы минуты секунды»,
  // то сначала их надо перевести в десятичную форму, примерно так - «градусы + (минуты + секунды/60)/60».
  // Если речь идет о земных координатах,
  // надо учитывать еще и знак:
  // северная широта и восточная долгота — знак плюс,
  // южная широта и западная долгота — минус.
  degreeToRadian(degree) {
    return (degree * Math.PI) / 180;
  }
}

module.exports = GpxParser;
