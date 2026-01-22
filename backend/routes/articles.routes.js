import express from 'express';
import {getArticlesByTitle, addArticle, editArticle, getRandomArticles, getArticleById, getFavoriteArticles} from '../controllers/articles.controller.js';
import { validateUser } from '../middleware/validate_user.js';
export const articlesRouter = express.Router();

//primer ficar rutes estàtiques

articlesRouter.get('/', getRandomArticles);

articlesRouter.get('/favorites', validateUser, getFavoriteArticles);

//segon rutes dinàmiques

articlesRouter.get('/expand/:id', getArticleById);

articlesRouter.get('/:title', getArticlesByTitle);


//tercer rutes d'escritura(modifiquen la base de dades amb put post...)

articlesRouter.put('/edit/:id', validateUser, editArticle);

articlesRouter.post('/', validateUser, addArticle);


