import { mongodbInstance } from '../infrastructure/mongodb-connection.js';

const articleSchema = new mongodbInstance.Schema({
  id: {type: Number,  unique: true,index: true},
  title: String,
  content: String,
  creatBy: { type: String, required: true },
  actualitzatBy: { type: String, default: null }
}, { timestamps: true });


export const articleMongooseModel = mongodbInstance.model('Article', articleSchema);


  export async function getRandomDBArticles() {
    //agregate es una funcio "pipeline" --> cadena de operacions que mongoDB s'executen succesivament
    const articles = await articleMongooseModel.aggregate([ {$sample : {size: 10} }]); //agafem 10 articles a l'atzar
    return articles
  }



export async function getDBArticlesByTitle(title) {

  const articles = await articleMongooseModel.find({ title: { $regex: title, $options: 'i' }}); //$regex -> busca coincidencies dins d'un text, $options: 'i' per ignorar majuscules minuscules
  return articles; //retorna un array que pot estar buit
}


export async function getDBArticleById(id) {
  const article = await articleMongooseModel.findOne({id: id});
  return article;
}


export async function addDBArticle(article, username) {
  // Obtenim ultim id
  const lastArticle = await articleMongooseModel.findOne().sort({ id: -1 }); //busquem el primer objecte que ens surti, pero ordenem els id de forma descendent (agafa el id mes alt)
  const lastId = lastArticle ? lastArticle.id : 0; //guarda lastId(id mes alt), en cas de que sigui null, afegim un id 0

  const newArticle = new articleMongooseModel({
    id: lastId + 1, //afegim +1 al id, ja que sino es repetiria (amb el del id més alt)
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
    { id: article.id },
    { title: article.title,
      content: article.content,
      actualitzatBy: username
    },
    { new: true } // retorna document actualitzat
  );

  if (!updated) return null;

  console.log("Article editat");
  return updated;
}


export async function searchDBArticlesbyId(favoriteArticlesId){
  //como no se puede borrar articulos (en principio), no se controla casos de que no exista el id
  const articles = await articleMongooseModel.find({ id: {$in: favoriteArticlesId}});
  return articles;
}



