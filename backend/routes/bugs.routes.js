import express from 'express';
import { validateUser } from '../middleware/validate_user.js';
import { getAllBugs, getBug, addBug, editBug } from "../controllers/bugs.controllers.js"



export const bugsRouter = express.Router();

//ruta per agafar la llista de reports
bugsRouter.get('/getall', getAllBugs);  //funciona


//ruta per agafar un sol bug
bugsRouter.get('/:id', getBug); //funciona


//ruta per fer un post de un bug
bugsRouter.post('/postbug', addBug); //funciona


//ruta per fer una actualitzacio de un bug
bugsRouter.patch('/update/:id', editBug); //funciona, falten filtres 




