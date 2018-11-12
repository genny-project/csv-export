'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCsv = exports.csv = undefined;

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _csvString = require('csv-string');

var CSV = _interopRequireWildcard(_csvString);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _v = require('uuid/v1');

var _v2 = _interopRequireDefault(_v);

var _aws = require('../utils/aws.utils');

var _aws2 = _interopRequireDefault(_aws);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BUCKET_NAME = _config2.default.bucketName;
var IAM_USER_KEY = _config2.default.keyId;
var IAM_USER_SECRET = _config2.default.accessKey;
var URL = _config2.default.url;
_awsSdk2.default.config.update({ accessKeyId: IAM_USER_KEY, secretAccessKey: IAM_USER_SECRET });
var s3bucket = new _awsSdk2.default.S3({ params: { Bucket: BUCKET_NAME } });

var createCsvWriter = require('csv-writer').createArrayCsvWriter;

var csv = function csv(req, res) {
  var csvString = req.body || null;
  if (csvString) {
    var check = csvString;
    try {
      var arr = CSV.parse(JSON.stringify(check));
      var filename = (0, _v2.default)();
      var csvWriter = createCsvWriter({
        header: arr[0],
        path: _path2.default.join(__dirname, '../../public/uploads/' + filename + '.csv')
      });

      var records = arr;

      csvWriter.writeRecords(records) // returns a promise
      .then(function () {
        console.log('...File written on the disk');

        /* s3 upload begins here */
        var dummyFile = {};
        dummyFile.originalFilename = filename;
        dummyFile.path = _path2.default.join(__dirname, '../../public/uploads/' + filename + '.csv');

        (0, _aws2.default)(dummyFile, function (data) {
          console.log(data);
          var url = data.key;
          return res.status(200).json({ url: url });
        });
      });
    } catch (err) {
      res.status(500);
      console.log(' Error While writing csv');
      return res.json({ message: 'Error writing file ' });
    }
  } else {
    return res.status(500).json({ message: "String not found or doesn't exists" });
  }
};

var getCsv = function getCsv(req, res) {
  var _req$body$fileName = req.body.fileName,
      fileName = _req$body$fileName === undefined ? '2a83d400-e3d2-11e8-8a9c-030704f844fa.csv' : _req$body$fileName;


  var options = {
    Bucket: _config2.default.bucketName,
    Key: fileName
  };

  s3bucket.getObject(options, function (err, data) {
    res.attachment(fileName);
    res.send(data.Body);
  });
};

exports.csv = csv;
exports.getCsv = getCsv;