const { Trail } = require('../models')
// 操作fast-xml-parser
const fs = require('fs')
const { XMLParser, XMLBuilder } = require('fast-xml-parser')

let jsonObj = null // 解析後的xml並轉成JSON儲存

const gpxServices = {
  // 解析GPX(xml)檔，並將解析後的檔案轉成JSON
  parseGpxToJson: (gpxData, callback) => {
    const parserOptions = {
      attributeNamePrefix: '@_',
      attrNodeName: 'attr',
      textNodeName: '#text',
      ignoreAttributes: false,
      ignoreNameSpace: false,
      allowBooleanAttributes: true,
      parseNodeValue: true,
      parseAttributeValue: true,
      trimValues: true,
      cdataTagName: '__cdata',
      cdataPositionChar: '\\c',
      parseTrueNumberOnly: false,
      arrayMode: false,
      attributeValueProcessor: (val, attrName) => {
        if (attrName === 'version') return val
      }
    }
    try {
      const parser = new XMLParser(parserOptions);
      const jsonObj = parser.parse(gpxData);
      if (callback) {
        callback(null, jsonObj); // 在完成後呼叫回調函式並傳遞結果
      }
      return jsonObj; // 直接返回解析結果
    } catch (error) {
      if (callback) {
        callback(error, null); // 在出現錯誤時呼叫回調函式並傳遞錯誤
      }
      throw new Error('Error while parsing GPX XML');
    }
  },
  parseJsonToGpx: (gpxJson, callback) => {
    const builderOptions = {
      attributeNamePrefix: '@_',
      attrNodeName: 'attr',
      textNodeName: '#text',
      ignoreAttributes: false,
      cdataTagName: '__cdata',
      cdataPositionChar: '\\c',
      format: true,
      indentBy: '  ',
    };
    try {
      const builder = new XMLBuilder(builderOptions)
      const gpxXml = builder.build(gpxJson)
      callback(null, gpxXml)
    } catch (error) {
      console.error(error)
      callback(new Error('Error while building GPX XML'), null)
    }
  }
}

module.exports = gpxServices
