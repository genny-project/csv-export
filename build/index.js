'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _prettyError = require('pretty-error');

var _prettyError2 = _interopRequireDefault(_prettyError);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

_prettyError2.default.start();
/* application level middlewares */
app.use(_bodyParser2.default.urlencoded({ extended: true })).use(_bodyParser2.default.json()).use((0, _morgan2.default)('combined')).use((0, _cors2.default)());

app.use(_express2.default.static(_path2.default.join('{__dirname}/../public')));

/* image uplados middleware */
app.use((0, _multer2.default)({ dest: __dirname + '/../public/uploads' }).any());

/* BASE API */
app.get('/', function (req, res) {
  return res.json({ message: ' CSV BASE URL ' });
});

/* Inject Secondary Routes */

app.use('/', _routes2.default);

app.listen(_config2.default.port, function () {
  console.log('The App is now running on PORT ' + _config2.default.port); // eslint-disable-line
});