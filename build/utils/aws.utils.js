'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BUCKET_NAME = _config2.default.bucketName;
var IAM_USER_KEY = _config2.default.keyId;
var IAM_USER_SECRET = _config2.default.accessKey;

_awsSdk2.default.config.update({ accessKeyId: IAM_USER_KEY, secretAccessKey: IAM_USER_SECRET });

var upload = function upload(file1, callback) {
  var file = file1;

  _fs2.default.readFile(file.path, function (err, data) {
    if (err) throw err; // Something went wrong!
    var s3bucket = new _awsSdk2.default.S3({ params: { Bucket: BUCKET_NAME } });
    s3bucket.createBucket(function () {
      var params = {
        Key: file.originalFilename + '.csv', // file.name doesn't exist as a property
        Body: data
      };

      s3bucket.upload(params, function (err, data) {
        // Whether there is an error or not, delete the temp file
        _fs2.default.unlink(file.path, function (err) {
          if (err) {
            console.error(err);
          }
          console.log('Temp File Delete');
        });

        console.log('PRINT FILE:', file);
        if (err) {
          console.log('ERROR MSG: ', err);
          // res.status(500).send(err);
        }
        callback(data);
        console.log(data, 'response back from aws');
        console.log('Successfully uploaded data');
      });
    });
  });
};

exports.default = upload;