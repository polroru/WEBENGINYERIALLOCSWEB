import express from 'express';
import { infoUsuari, signIn, signUp, addFavoriteArticle, isFavorite, removeFavorite} from '../controllers/users.controller.js';
import { validateUser } from '../middleware/validate_user.js';

export const usersRouter = express.Router();



//agafar info de usuari, es pot fer directament amb el sign in i sign up ja que retornen el email y
usersRouter.get('/me', validateUser, infoUsuari);

usersRouter.get('/isfavorite/:username', validateUser, isFavorite);

//iniciar sesio retorna username, email i token
usersRouter.post('/signin', signIn);

//crear usuari, retorna username, email i token
usersRouter.post('/signup', signUp);

//afegir article favorit
usersRouter.put('/addfavorite/:username', validateUser, addFavoriteArticle);

usersRouter.delete('/removefavorite/:username', validateUser, removeFavorite);


