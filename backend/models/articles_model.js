import { mongodbInstance } from '../infrastructure/mongodb-connection.js';
import { ObjectId } from 'mongodb';
import { removeDBArticleFromAllFavorites } from './users_models.js';


const articleSchema = new mongodbInstance.Schema({
  title: String,
  content: String,
  state: {
    type: String,
    enum: ['active', 'deleted'], // nomes aquests dos valors
    default: 'active'          //default esta active
  },
  creatBy: { type: String, required: true },
  actualitzatBy: { type: String, default: null }
}, { timestamps: true });


/* 
    MONGOOSE OBJECT:
{
  _id: ObjectId("64f..."),
  title: "title",
  content: "contingut",
  save: [Function],
  remove: [Function],
  //...altres funcions
}

    JAVA OBJECT
{
  _id: "64f...",  // string
  title: "title",
  content: "contingut"
}

*/


export const articleMongooseModel = mongodbInstance.model('Article', articleSchema); //'Article --> nom del model'



  //funcio per agafar articles random (10)
export async function getRandomDBArticles() {
  //agregate es una funcio "pipeline" --> cadena de operacions que mongoDB s'executen succesivament
  //han d'estar actius per a poder ser agafats(que no estiguin eliminats)
  const articles = await articleMongooseModel.aggregate([{ $match: { state: 'active' } }, {$sample : {size: 10} }]); //agafem 10 articles a l'atzar
    
  
    //funcio aggregate retorna objecte "pla" mentres que find torna un mongoose object
    //funcio map retorna una nova array amb les modificacions que fem a cada iteracio
    //en aquest cas, en cada iteracio passem a string cada _id (objectId) (tambe copiem els altres camps)
  const articlesData = articles.map(article => ({
    ...article, //no fa falta transformar a objecte pla, perque ja ho es
    _id: article._id.toString()
  }));
  return articlesData;
}


  //funcio que retorna articles amb el titol (pot ser titols semblants, pel que retorna un array)
export async function getDBArticlesByTitle(title) {

    //$regex -> busca coincidencies dins d'un text, $options: 'i' per ignorar majuscules minuscules
    //han d'estar "actius"
  const articles = await articleMongooseModel.find({ title: { $regex: title, $options: 'i' }, state: 'active' }); 
    
    //convertim id a string en cada iteracio, com aqui es un mongoose object, transformem a objecte pla
  const articlesData = articles.map(article => ({
    ...article.toObject(),
    _id: article._id.toString()
  }));

  return articlesData; //retorna un array que pot estar buit
}





  //funcio per agafar un article mitjançant el seu Id
export async function getDBArticleById(id) {
  //ha d'estar actiu
  const article = await articleMongooseModel.findOne({ _id: new ObjectId(id), state: 'active' });  
  if (!article) return null; // mper si un cas es null


    //convertim id a string
  const articleData = {
    ...article.toObject(),
    _id: article._id.toString()
  };
  return articleData;
}

  //funcio per afegir article
export async function addDBArticle(article, username) {
    
  const newArticle = new articleMongooseModel({
    title: article.title,
    content: article.content,
    creatBy: username
  });

  await newArticle.save();
  console.log("Article afegit");
  return newArticle;
}


export async function editDBArticle(article, username) {
  const updated = await articleMongooseModel.findOneAndUpdate(//busca per id i per si esta actiu
    { _id: new ObjectId(article.id), state: 'active'},
    { title: article.title,
      content: article.content,
      actualitzatBy: username
    },
    { new: true } // retorna document actualitzat
  );

  if (!updated) return null;

  console.log("Article editat");
  return{
    ...updated.toObject(), //... es un "spread operator", serviex per a copiar totes les propietats dins d'un objecte a un nou
    _id: updated._id.toString() //edito el tipo de dada del camp _id de pasar el tipus de dada "ObjectId" a string per a que el frontend la pugi utilitzar de forma correcta (el id)
  }
}

  //funcio que retorna un array d'articles amb els ids dels articles favs
export async function searchDBArticlesbyId(favoriteArticlesId){
  const articles = await articleMongooseModel.find({ _id: {$in: favoriteArticlesId}, state: 'active'});

  //convertim id a string
  const articlesData = articles.map(article => ({
    ...article.toObject(),  // transformem el mongoose object a objecte pla
    _id: article._id.toString()
  }));
  return articlesData;
}



  //funcio que "elimina" o fica en hide els articles
export async function deleteDBArticle(articleId) {
  //busquem mitjançant id i canviem l'estat
  const updatedArticle = await articleMongooseModel.findOneAndUpdate(
    { _id: new ObjectId(articleId) },
    { state: 'deleted' }, // o 'state: "deleted"' según convenga
    { new: true }
  );

  //per si un cas es null
  if (!updatedArticle) return null;
  //per si un cas ja esta deleted
  if (updatedArticle.state === 'deleted') {
    return null;
  }


  await removeDBArticleFromAllFavorites(updatedArticle._id);
  return updatedArticle; //retorna amb objectId!!
}

