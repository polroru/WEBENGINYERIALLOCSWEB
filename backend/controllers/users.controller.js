import { addDBUser, searchUserDBEmail, searchUserDBUsername, userFavoritesDB, addFavoriteDBArticle, searchFavoriteIdDB, removeFavoriteDB} from "../models/users_models.js";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../middleware/validate_user.js";
import  bcrypt from 'bcrypt';
import { User } from '../models/users_models.js';


export async function signUp(req, res) {
  const newUser = req.body;
  const username = newUser.username?.trim();
  const email = newUser.email?.trim();
  const password = newUser.password?.trim();
  let stat = 201;
  let response;

  if (!username || !email || !password) {
    stat = 400;
    response = {
      estat: "ERROR",
      message: "Falten dades"
    }
  }else if (!/^[a-zA-Z0-9]+$/.test(username)) {
    stat = 400;
    response = { estat: "ERROR", message: "Username nomes pot contenir lletres i numeros" };
  }else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    stat = 400;
    response = { estat: "ERROR", message: "Email no valid" };
  }else if(await searchUserDBEmail(email) != null){
    stat = 409;
    response = {estat: "ERROR", message: "Email existent"};
  }else if(await searchUserDBUsername(username) != null){
    stat = 409;
    response = {estat: "ERROR", message: "Username existent"};
  }
  else {



// bcrypt genera una salt (valor aleatorio que se agrega a la password y luego se hashea) aleatoria cada vez que hace hash de la contraseña
// el hash final incluye la salt y el número de rondas (el 10)
// al comparar, bcrypt usa la salt del hash para verificar la contraseña
// nunca se guarda la contraseña ni la salt por separado
// cost factor indica cuántas rondas se aplican, más alto = más seguro pero más lento


    const passwordEncriptada = await bcrypt.hash(password, 10); //password hasheada, el 10 significa que es fan 10 "rondes" de hash
    const addedUser = await addDBUser({ username, email, password: passwordEncriptada });
    //bcrypt despres compara la contrasenya (treu el "salt" directament de el hash final, despres agafa la contrasenya escrita, la hashea amb el "salt" i despres compara amb el hash final guardat)


    //creem un token
    const token = jwt.sign({ username: addedUser.username }, JWT_SECRET, { expiresIn: '1h' });

    response = {
      estat: "SUCCESS",
      user: {
        username: addedUser.username,
        email: addedUser.email
      },
      token
};
  }
  return res.status(stat).json(response);
}

// Nota:
// - Username permet  (a-z, A-Z) i numeros (0-9)
/*
Normes de l'email:

Part local (abans de l'@):
   - Només permet lletres (a-z, A-Z), números (0-9) i els caràcters especials: . _ % + -
   - Ha de tenir com a mínim un caràcter.
   - Exemples vàlids: "usuari123", "joan.perez", "mi_email+test"

Símbol obligatori:
   - Un únic '@' separa la part local del domini.

Domini (després de l'@):
   - Només permet lletres (a-z, A-Z), números (0-9), guions i punts.
   - Exemple vàlid: "midomini.com", "sub.domini.net"

Extensió (després de l'últim .):
   - Només lletres (a-z, A-Z)
   - Com a mínim 2 caràcters
   - Exemples vàlids: ".com", ".es", ".info"

No permesos:
   - Espais
   - Caràcters especials fora dels permesos (. _ % + -)
   - Emails com "1@1.1" o "!@example.com" són invàlids
*/


export async function signIn(req, res) {
  let { email, password } = req.body;
  let response;
  let stat = 200;

  email = email?.trim();
  password = password?.trim();

  if (!email || !password) {
    stat = 400;
    response = {
      estat: "ERROR",
      message: "Falten dades"
    };
  } else {
    //busco usuari i valido (si existeix)
    const userData = await searchUserDBEmail(email);

    if (userData == null) {
      stat = 404;
      response = {
        estat: "ERROR",
        message: "Email incorrecte"
      };
    } else {
      const passwordCorrecta = await bcrypt.compare(password, userData.password);
      //creem token
      if(!passwordCorrecta){
        stat = 401;
        response = {
          estat: "ERROR",
          message: "Contrasenya incorrecta"
        };
      }else{
        const token = jwt.sign({ username: userData.username }, JWT_SECRET, { expiresIn: '1h' });
        response = {
          estat: "SUCCESS",
          user: {
            username: userData.username,
            email: email
          },
          token
        };
      }
    }
  }
  return res.status(stat).json(response);
}



export function infoUsuari(req, res) {
  // req.user viene del jwt.verify
  res.json({
    username: req.user.username,
  });
}


export async function userFavorites(req, res) {
  try {
    // 1️⃣ Sacamos los IDs de favoritos del usuario
    const favoriteArticlesId = await userFavoritesDB(req.params.username);
    console.log(req.params.username);

    // 2️⃣ Si no hay favoritos, devolvemos array vacío
    if (!favoriteArticlesId || favoriteArticlesId.length === 0) {
      return res.status(200).json([]); // devolvemos array vacío
    }

    // 3️⃣ Buscamos los artículos completos en la DB
    const favoriteArticles = await searchDBArticlesbyId(favoriteArticlesId);

    // 4️⃣ Respondemos con los artículos
    res.status(200).json(favoriteArticles);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener favoritos' });
  }
}

//funcio per afegir id d'article existen en
export async function addFavoriteArticle(req, res){

  //agafo el id i ho transformo a numero per si un cas
  const articleId = req.body.articleId;

  const username = req.params.username;
  console.log(articleId);
  //const article = await getDBArticleById()
  const resultat = await addFavoriteDBArticle(username, articleId);

  if(resultat.matchedCount === 0){
    console.log("User no existe");
    return res.status(404).json({message: 'Usuari no existeix'});
  }
  if(resultat.modifiedCount === 0){
    console.log("Ya era favorito");
    return res.status(200).json({message: 'Ja era favorit'});
  }
  console.log("añadido a favorito");
  res.status(200).json({message: 'Afegit a favorits'});
}

//funcio per veure si un id d'article es favorit
export async function isFavorite(req, res) {
  const username = req.user.username; // mejor que venir por params
  const articleId = req.query.articleId;

  if (!articleId) return res.status(400).json({ error: 'Falta articleId' });

  console.log('isFavorite - username:', username, 'articleId:', articleId);

  const user = await User.findOne({
    username,
    favorites: { $in: [articleId] } // perfecto si son strings
  });

  return res.json(user !== null);
}



//trec de favorit si existeix user, esta el id en l'array de favorit
export async function removeFavorite(req, res){
  console.log("vamos a eliminar");
  //agafo el id i ho transformo a numero per si un cas
  const articleId = req.query.articleId;

  const username = req.params.username;
  const resultat = await removeFavoriteDB(username, articleId);

  if(resultat.matchedCount === 0){
    console.log("User no existeix");
    return res.status(404).json({message: 'Usuari no existeix'});
  }
  if(resultat.modifiedCount === 0){
    console.log("No era favorito");
    return res.status(200).json({message: 'No era favorit'});
  }
  console.log("Favorito eliminado");
  res.status(200).json({message: 'Favorit eliminat'});
}


