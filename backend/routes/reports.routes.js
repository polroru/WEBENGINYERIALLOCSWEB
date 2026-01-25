import express from 'express';
import { validateUser } from '../middleware/validate_user.js';

export const reportsRouter = express.Router();



//primer el /all per a no interferir amb id

usersRouter.get('/all', validateUser, getAllReports);

usersRouter.get('/:id', validateUser, getReport);


//post per afegir report
usersRouter.post('/addreport', validateUser, addNewReport);

//patch per modificar report
usersRouter.patch('/solveReport', solveReport);



