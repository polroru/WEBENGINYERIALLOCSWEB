import { mongodbInstance } from '../infrastructure/mongodb-connection.js';
import { ObjectId } from 'mongodb';

const articleSchema = new mongodbInstance.Schema({
  title: String,
  content: String,
  creatBy: { type: String, required: true },
  actualitzatBy: { type: String, default: null }
}, { timestamps: true });


export const articleMongooseModel = mongodbInstance.model('Article', articleSchema); //'Article --> nom del model'


  export async function getRandomDBArticles() {
    //agregate es una funcio "pipeline" --> cadena de operacions que mongoDB s'executen succesivament
    const articles = await articleMongooseModel.aggregate([ {$sample : {size: 10} }]); //agafem 10 articles a l'atzar
    return articles;
  }



export async function getDBArticlesByTitle(title) {

  const articles = await articleMongooseModel.find({ title: { $regex: title, $options: 'i' }}); //$regex -> busca coincidencies dins d'un text, $options: 'i' per ignorar majuscules minuscules
  return articles; //retorna un array que pot estar buit
}


export async function getDBArticleById(id) {
  const article = await articleMongooseModel.findOne({ _id: new ObjectId(id) });  
  return article;
}


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
  const updated = await articleMongooseModel.findOneAndUpdate(
    { _id: new ObjectId(article.id) },
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


export async function searchDBArticlesbyId(favoriteArticlesId){
  //como no se puede borrar articulos (en principio), no se controla casos de que no exista el id
  const articles = await articleMongooseModel.find({ _id: {$in: favoriteArticlesId}});
  return articles;
}



