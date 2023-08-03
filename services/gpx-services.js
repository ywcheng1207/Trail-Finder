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
    const parser = new XMLParser(parserOptions)
    const gpxObj = parser.parse(gpxData)
    jsonObj = gpxObj // 將解析後的 JSON 物件賦值給 jsonObj
    return callback(null, {
      gpxObj: gpxObj // 直接返回解析後的 JSON 物件
    })
  },
  // 將JSON格式的資料轉換回GPX(xml)並儲存至暫存資料夾temp
  parseJsonToGpxThenSaveTemp: (jsonObj, callback) => {
    const fileName = 'outputTest'
    const builderOptions = {
      attributeNamePrefix: '@_',
      attrNodeName: 'attr',
      textNodeName: '#text',
      ignoreAttributes: false,
      cdataTagName: '__cdata',
      cdataPositionChar: '\\c',
      format: true,
      indentBy: '  '
    }
    const builder = new XMLBuilder(builderOptions)
    const gpxXml = builder.build(JSON.parse(jsonObj))

    try {
      fs.writeFileSync(`./temp/${fileName}.gpx`, gpxXml, 'utf-8')
      callback(null, {
        gpxXml: gpxXml
      });
    } catch (error) {
      console.error(error);
      callback(new Error('Error while writing GPX XML'), null)
    }
  },
  // 將解析完成的JSON檔存到mySQL，執行前請先完成解析步驟(GET /parsexml)
  saveParsedJsonToMysql: async (req, callback) => {
    const jsonObj = req.body
    try {
      if (jsonObj) {
        await Trail.create({
          gpx: jsonObj,
        })
        callback(null, 'this is json-saving page.')
      } else {
        console.log('no data')
        callback(new Error('No data'), null)
      }
    } catch (error) {
      console.error(error);
      callback(new Error('Internal Server Error'), null)
    }
  },

  // 從mySQL中取出JSON資料(只是撈出資料，還沒轉換成xml檔)
  retrieveJsonFromMysql: async (req, callback) => {
    const id = req.params.id;
    try {
      const gpxJson = await Trail.findAll({
        where: { id },
        raw: true,
      })
      if (gpxJson && gpxJson.length > 0) {
        const gpxData = JSON.parse(gpxJson[0].gpx)
        console.log('gpxJson:', gpxJson[0].gpx)
        console.log('gpxJson to xml:', gpxData)
        callback(null, gpxData);
      } else {
        console.log("can't find data");
        callback(new Error("Data not found"), null)
      }
    } catch (error) {
      console.error(error)
      callback(new Error('Internal Server Error'), null)
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
