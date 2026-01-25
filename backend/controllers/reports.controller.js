import { getDBReport, getDBReportState, getAllDBReports, addNewDBReport, solveDBReport } from "../models/report_model.js";



    //funcio per agafar 1 sol report

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

export async function addNewReport(req, res) {
  const { reportData } = req.body; //desestructuro les dades
  if(!reportData.articleId) {
    return res.status(400).json({ error: 'Falten dades.' });
  }

  console.log(reportData);
  console.log(req.user.username);
  const addedReport = await addNewDBReport(reportData, req.user.username);
  res.status(201).json(addedReport);
}

    //funcio per editar la funcio (estat), també s'hauria de borrar

export async function solveReport(req, res) {
  const { reportData} = req.body; 
  if (!reportData.articleId) {
    return res.status(400).json({ error: 'Falta el id del artícle.' });
  }
    const updatedReport = await solveDBReport(reportData);

  if (!updatedReport) {
    return res.status(404).json({ error: 'Article no trobat' });
  }

  res.status(200).json(updatedReport);
}



    //funcio que em torna tots els reports ()

export async function getReportsController(req, res) {
  const page = parseInt(req.query.page) || 1;   //s'envien al query en format string( per aixo el parseInt)
  const limit = parseInt(req.query.limit) || 10;

  try {
    const result = await getAllDBReports(page, limit);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener reports" });
  }
}
