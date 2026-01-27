import express from 'express';
import { validateUser } from '../middleware/validate_user.js';
import { esAdmin } from '../middleware/es_admin.js';
import {getReportsPaginacio, getReport, addNewReport, solveReport} from '../controllers/reports.controller.js';

export const reportsRouter = express.Router();



//primer el /all per a no interferir amb id

    //tots els reports
reportsRouter.get('/all', validateUser, esAdmin, getReportsPaginacio);

    //nomes un report
reportsRouter.get('/:id', validateUser, esAdmin, getReport);


    //post per afegir report
reportsRouter.post('/addreport', validateUser, addNewReport); //no fa falta ser admin per fer un report

    //patch per modificar report
reportsRouter.patch('/solvereport/:id', validateUser, esAdmin, solveReport);



