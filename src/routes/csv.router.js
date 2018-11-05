import express from 'express';
import { csv } from '../controllers/csv.controller';

const Router = express.Router();


Router.get('/', csv);

export default Router;
