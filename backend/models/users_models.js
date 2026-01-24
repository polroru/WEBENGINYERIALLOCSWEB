// models/users_model.js
import { mongodbInstance } from '../infrastructure/mongodb-connection.js';

// Definición del esquema
const userSchema = new mongodbInstance.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  /*Llista de favs, amb  referencia a article amb el seu id, default es null*/
  favorites: {
  type: [{type: String}],     // array de strings
  default: []
  }
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
  return newUser;
}

export async function searchUserDBEmail(email) {
  return await User.findOne({ email });
}

export async function searchUserDBUsername(username) {
  return await User.findOne({ username });
}

export async function userFavoritesDB(username){
  const user = await User.findOne({ username });
  console.log(username);
  if(!user){
    return [];
  }
  return user.favorites;
}

export async function addFavoriteDBArticle(username, articleId){
  return await User.updateOne({username}, {$addToSet: {favorites: articleId}});

  /*
    updatedOne, permet bsucar mitjançant un camp (username en aquest cas) i modificar altres
    Aquest retorna:
      -aknowledged -> boolean per saber si mongo reb i executa funcio
      -matchedCount -> numero de documents que coincidien amb el filtre
      -modifiedCount -> quants documents s'han modificat
  */
}

export async function searchFavoriteIdDB(username, articleId){
  return await User.findOne({username: username, favorites:{ $in: [articleId]}});

}

export async function removeFavoriteDB(username, articleId){
  return await User.updateOne({username}, {$pull: {favorites: articleId}});
}

