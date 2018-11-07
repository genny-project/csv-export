'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.csv = undefined;

var _csvString = require('csv-string');

var _csvString2 = _interopRequireDefault(_csvString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var csv = function csv(req, res) {
  var csvString = req.body || null;

  arr = CSV.parse(csvString);

  console.log(arr);

  return res.json({ url: 'URL goes here' });
};

exports.csv = csv;