import { mongodbInstance } from '../infrastructure/mongodb-connection.js';
import { ObjectId } from 'mongodb';

const reportSchema = new mongodbInstance.Schema({
  articleId: String,
  comment: String,
  creatBy: { type: String, required: true },
  state: {
    type: String,
    enum: ['solved', 'unsolved'], // nomes aquests dos valors
    default: 'unsolved'          //default esta unsolved
}
}, { timestamps: true }); //crea createdAt y updatedAt de forma automatica

export const reportMongooseModel = mongodbInstance.model('Report', reportSchema);



//agafar 1 report
//getReport
export async function getDBReport(id){
  const report = await reportMongooseModel.findOne({ _id: new ObjectId(id)});
  return report;
}


//funcio per veure l'estat de un report (de moment no te utilitat)

export async function getDBReportState(id){
  const report =  await reportMongooseModel.findOne({_id: new ObjectId(id)}, { state : 1}); //amb state: 1, crea nomes un objecte amb aquest _id y el camp que he posat (state). si volem mes camps--> { state: 1, creatBy: 1} 
  if (!report) return false; //en el cas de que estigui buit

  return report.state === 'solved'; //retorna true si l'estat es 'solved', sino false
}


//getAllReports amb paginacio

export async function getAllDBReports(page, limit) {
    //calculem la quanitat de reports que ja hem agafat anteriorment, en cas de que sigui la primera pagina --> 0
  const skip = (page - 1) * limit; 

    //fem la seguent request a la base de dades: 
    /*
      *find() --> agafem tots
      *skip(x) --> ens saltem x objectes
      *limit(x) --> fins a x objecte
      *sort(x) --> ordenem per x norma, en aquest cas, per data de creació (de forma descendent) 
    */
  const reports = await reportMongooseModel.find().skip(skip).limit(limit).sort({ createdAt: -1 });

    //contem el total de reports que hi han
  const total = await reportMongooseModel.countDocuments();

    //retorno el total de documents que hi han, la pagina actual, el limit agafat i l'array de reports
    //aquesta info per donar info al usuari que utilitza el frontend
  return { total, page, limit, reports };
}

//add report

export async function addNewDBReport(report, username) {
 
  const newReport = new reportMongooseModel({
    articleId: report.articleId,
    comment: report.comment || '',    // pot estar buit
    creatBy: username,          
  });

  await newReport.save();
  return newReport;
}

//editar estat de report

export async function solveDBReport(reportId) {
  
    //fem un findOneAndUpdate, busquem el report id i mitjançant $ne (not equal) tambe filtrem per si esta en l'estat solved
    //en cas de no estar en estat solved (not equal), aquest actualitza a solved
    //tot aixo en una sola query

  const updated = await reportMongooseModel.findOneAndUpdate(
    { _id: new ObjectId(reportId), state: { $ne: 'solved' } },
    { state: 'solved' },
    { new: true } //retorno objecte nou
  );

  // en cas de no exisitir o ja estar solved
  if (!updated) return false;

  console.log("Report editat");
  return {
    ...updated.toObject(),
    _id: updated._id.toString()
  };
}


