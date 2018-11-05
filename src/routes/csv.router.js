import express from 'express';
import { csv } from '../controllers/csv.controller';

const Router = express.Router();


Router.post('/', csv);

export default Router;
