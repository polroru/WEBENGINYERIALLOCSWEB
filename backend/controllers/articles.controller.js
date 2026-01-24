import { getRandomDBArticles, addDBArticle, editDBArticle, getDBArticlesByTitle, getDBArticleById, searchDBArticlesbyId} from "../models/articles_model.js";

import { userFavoritesDB } from "../models/users_models.js";

export async function getRandomArticles(req, res) {
  const articles = await getRandomDBArticles();
  res.json(articles);
}

export async function getArticlesByTitle(req, res) {
  const title = req.params.title;
  const articles = await getDBArticlesByTitle(title); //reotrna array
  res.json(articles); // tornem el array al forntend
}


export async function getArticleById(req, res) {
  const id = req.params.id;
  const article = await getDBArticleById(id);
  res.json(article);
}

export async function addArticle(req, res) {
  const { articleData } = req.body; //desestructurem
  if(!articleData.title || !articleData.content) {
    return res.status(400).json({ error: 'Falten dades.' });
  }

  console.log(articleData);
  console.log(req.user.username);
  const addedArticle = await addDBArticle(articleData, req.user.username);
  res.status(201).json(addedArticle);
}

export async function editArticle(req, res) {
  const { articleData} = req.body; //desestrctrem
  if (!articleData.id) {
    return res.status(400).json({ error: 'Falta el id del artícle.' });
  }else if (!articleData.title || !articleData.content) {
    return res.status(400).json({ error: 'Falten dades.' });
  }

  //Pasas el objeto completo a la función del modelo
  const updatedArticle = await editDBArticle(articleData, req.user.username);

  if (!updatedArticle) {
    return res.status(404).json({ error: 'Article no trobat' });
  }

  res.status(200).json(updatedArticle);
}



export async function getFavoriteArticles(req, res) {
  try {
    const username = req.user.username; // del middleware
    console.log("Username:", username);

    // Esto devuelve solo un array de IDs
    const favoriteArticlesId = await userFavoritesDB(username);

    if (!favoriteArticlesId || favoriteArticlesId.length === 0) {
      return res.status(200).json([]); // array vacío si no hay favoritos
    }

    const favoriteArticles = await searchDBArticlesbyId(favoriteArticlesId);

    res.status(200).json(favoriteArticles);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener favoritos' });
  }
}
