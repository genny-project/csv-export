import express from 'express';
import { csv, getCsv } from '../controllers/csv.controller';

const Router = express.Router();


Router.post('/', csv);
Router.get('/download/:fileName', getCsv);

export default Router;
