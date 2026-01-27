// models/users_model.js
import { mongodbInstance } from '../infrastructure/mongodb-connection.js';
import { ObjectId } from 'mongodb';

// Definición del esquema
const userSchema = new mongodbInstance.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  rol: { type: String, enum: ['user', 'admin'], default: 'user' }, //rol admin i user
  password: { type: String, required: true },
  /*Llista de favs, amb  referencia a article amb el seu id, default es null*/
  favorites: [{ type: ObjectId, ref: 'Article' }]
});



export const User = mongodbInstance.model('User', userSchema);

// afegir usuari
export async function addDBUser(user) {

  const newUser = new User({
    username: user.username,
    email: user.email,
    password: user.password
  });

  await newUser.save();
  console.log("Usuari afegit");

    //he de retornar amb el id en format string (id de user i l'array de ids)
  return {
    ...newUser.toObject(),
    _id: newUser._id.toString(),
    favorites: []
};
}


  //funcio per retornar user mitjançant email
export async function searchUserDBEmail(email) {
  const user = await User.findOne({ email });
  
    //per si un cas es null
  if (!user) return null;

  //tornem a ficar els ids en strings (favs es unn array, pel que necesito fer iteracio per iteracio)
  return {
    ...user.toObject(),
    _id: user._id.toString(),
    favorites: user.favorites.map(fav => fav.toString())
  };
}
  //funcio per retornar user mitjançant username
export async function searchUserDBUsername(username) {
  const user = await User.findOne({ username });
  
    //per si un cas es null
  if (!user) return null;

  //tornem a ficar els ids en strings (favs es unn array, pel que necesito fer iteracio per iteracio)
  return {
    ...user.toObject(),
    _id: user._id.toString(),
    favorites: user.favorites.map(fav => fav.toString())
  };
}


  //funci per retornar tots els favs d'un usuari mitjançant el username
export async function userFavoritesDB(username) {
  const user = await User.findOne({ username });
  console.log(username);
  if (!user) return [];

  // totes les iteracions amb ObjectId a string (favs)
  return user.favorites.map(fav => fav.toString());
}

  //funcio per afegir a favorit (id de article)
export async function addFavoriteDBArticle(username, articleId){
    //convertir string (id) a objectId
  return await User.updateOne({username}, {$addToSet: {favorites: new ObjectId(articleId)}});

  /*
    updatedOne, permet bsucar mitjançant un camp (username en aquest cas) i modificar altres
    Aquest retorna:
      -aknowledged -> boolean per saber si mongo reb i executa funcio
      -matchedCount -> numero de documents que coincidien amb el filtre
      -modifiedCount -> quants documents s'han modificat
  */
}

  //funcio per eliminar fav mitjançant Username i ArticleId
export async function removeFavoriteDB(username, articleId){
    //per a que mongodb elimini el objectId del article, hem de transformar l'articleId que li pasem a objectId
  return await User.updateOne({username}, {$pull: {favorites: new ObjectId(articleId)}});
}


  //funcio per eliminar de favorits els articles que s'eliminen
export async function removeDBArticleFromAllFavorites(articleId) {
  await User.updateMany(
    { favorites: articleId },
    { $pull: { favorites: articleId } }
  );
}
