'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.load();

var config = {
  port: process.env.PORT || 7777,
  bucketName: process.env.BUCKET_NAME || null,
  accessKey: process.env.SECRET_ACCESS_KEY || null,
  keyId: process.env.ACCESS_KEY_ID || null,
  awsRegion: process.env.REGION,
  url: process.env.URL
};

exports.default = config;