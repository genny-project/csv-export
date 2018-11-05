import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import path from 'path';
import multer from 'multer';
import prettyError from 'pretty-error';
import config from './config';
import MainRouter from './routes';

const app = express();

prettyError.start();
/* application level middlewares */
app
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use(morgan('combined'));

app.use(express.static(path.join('{__dirname}/../public')));

/* image uplados middleware */
app.use(multer({ dest: `${__dirname}/../public/uploads` }).any());


/* BASE API */
app.get('/', (req, res) => res.json({ message: ' CSV BASE URL ' }));

/* Inject Secondary Routes */

app.use('/', MainRouter);

app.listen(config.port, () => {
  console.log(`The App is now running on PORT ${config.port}`); // eslint-disable-line
});
