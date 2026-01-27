import express from 'express';
import { validateUser } from '../middleware/validate_user.js';
import {getReportsPaginacio, getReport, addNewReport, solveReport} from '../controllers/reports.controller.js';

export const reportsRouter = express.Router();



//primer el /all per a no interferir amb id

reportsRouter.get('/all', getReportsPaginacio);

reportsRouter.get('/:id', validateUser, getReport);


//post per afegir report
reportsRouter.post('/addreport', validateUser, addNewReport);

//patch per modificar report
reportsRouter.patch('/solvereport/:id', validateUser, solveReport);



