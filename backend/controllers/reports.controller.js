import { getDBReport, getDBReportState, getAllDBReports, addNewDBReport, solveDBReport } from "../models/reports_model.js";







    //funcio per agafar 1 sol report
    //FUNCIONA PERFECTAMENTE

export async function getReport(req, res){
    const id = req.params.id;
    const report = await getDBReport(id);

        // en cas de no existir el report
    if (!report) {
      return res.status(404).json({ message: 'No existeix el report' });
    }

    res.json(report);
}






  //funcio per afegir reports
  // FALTA CONTROLAR PARA VER SI EXISTE EL ARTICULO, POR LO DEMAS YA FUNCIONA
export async function addNewReport(req, res) {
  const { reportData } = req.body; //desestructuro les dades
  if(!reportData.articleId || !reportData.articleTitle) {
    return res.status(400).json({ error: 'Falten dades.' });
  }

  console.log(reportData);
  const username = req.user?.username;
  const addedReport = await addNewDBReport(reportData, username );
  res.status(201).json(addedReport);
}




  //funcio per editar la funcio (estat), també s'hauria de borrar
  //FUNCIONA EL CANVI D'ESTAT, FALTARIA BORRAR

export async function solveReport(req, res) {
  const reportId = req.params.id; 
  if (!reportId) {
    return res.status(400).json({ error: 'Falta el id del report.' });
  }
    const updatedReport = await solveDBReport(reportId);

  if (!updatedReport) {
    return res.status(404).json({ error: 'Article no trobat o ja resolt' });
  }

  res.status(200).json(updatedReport);
}


  //funcio que em torna tots els reports ()
  //FUNCIONA PERFECTAMENT
  //ORDENAT PER MES RECENTS
  // http://localhost:3000/report/all?page=1&limit=5 A POSTMAN (QUERY PARAMS)

export async function getReportsPaginacio(req, res) {
  const page = parseInt(req.query.page) || 1;   //s'envien al query en format string( per aixo el parseInt)
  const limit = parseInt(req.query.limit) || 10;
  console.log("enviar paginacion");
    //comprovo que no siguin numeros negatius
  if (page < 1 || limit < 1) {
  return res.status(400).json({ message: "Page y limit deben ser positivos" });
}

  try {
    const result = await getAllDBReports(page, limit);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener reports" });
  }
}
