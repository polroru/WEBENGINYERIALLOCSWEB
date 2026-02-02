import {getDBBug, getAllDBBugs, addDBBug, editDBBug } from "../models/bug_model.js";



    //Creem status predeterminats

const validStatus = ['Open', 'Work in progress', 'Solved'];
const validOrdenar = ['asc', 'desc'];





//funcio per agafar tots els bugs
export async function getAllBugs(req,res){


    /*
            FILTRES
    */


    const filtres = {
        status: req.query.status,
        ordenarData: req.query.ordenarData,
        ordenarSeveritat: req.query.ordenarSeveritat
    }



    /*
                            COM PRIMER FILTREM LES DATES, AQUESTES TENEN PRIORITAT PER DAMUNT DE LA SEVERITAT
                            -> PRIMER MES O MENYS RECENTS I DESPRES MES O MENYS SEVERITAT
    
    */


    
        //comprovem que hi ha algo o que els parametres de filtre status esta dins dels camps permesos
    if (filtres.status && !validStatus.includes(filtres.status)) {
        return res.status(400).json({ error: 'Status no vàlid. Usa: Open, Work in progress o Solved' });
    }
    
        // Validar ordenarData (asc o desc)
    if (filtres.ordenarData && !validOrdenar.includes(filtres.ordenarData)) {
        return res.status(400).json({ error: 'ordenarData no vàlid. Usa: asc o desc' });
    }
    
        // Validar ordenarSeveritat (asc o desc)
    if (filtres.ordenarSeveritat && !validOrdenar.includes(filtres.ordenarSeveritat)) {
        return res.status(400).json({ error: 'ordenarSeveritat no vàlid. Usa: asc o desc' });
    }


    const bugs = await getAllDBBugs(filtres);
    if(!bugs){
        return res.status(404).json({message: 'No hi ha bugs a la base de dades'});
    }
    return res.status(200).json(bugs);
}




//funcio per agafar un bug mitjançant id
export async function getBug(req,res){
    const id = req.params.id; // es una string 
    const bug = await getDBBug(id);
    //fem una petita validacio de que existeix el bug
    if(!bug){
        return res.status(404).json({message: 'No existeix el bug a la base de dades'});
    }
    res.json(bug);
}




//funcio per crear nou bug
export async function addBug(req,res){
    const { bug_description, reproduction_steps, severity, additional_comments, status } = req.body;
    
        // D'aquesdta forma ens asegurem que no canviin camps que no s'han de tocar

    const bugData = {
        bug_description,
        reproduction_steps,
        severity,
        additional_comments: additional_comments || [],
        status: status || 'Open'
    };

 const missing = [];
 if (!bugData.bug_description) missing.push("bug_description"); if (!bugData.reproduction_steps) missing.push("reproduction_steps"); if (bugData.severity === undefined || bugData.severity === null) missing.push("severity"); if (missing.length > 0) { return res.status(400).json({ error: "Falten dades", missing_fields: missing }); }
    console.log("Nou bug afegit");
    const newBug = await addDBBug(bugData);
    return res.status(201).json(newBug);
}



//funcio per editar bug existent
export async function editBug(req,res){

    const { additional_comments, status } = req.body;
        //asigno els camps a un objecte
    const bugData = {};



            //valido si hi ha status i que status sigui correcte (si no hi ha no pasa res)
    if (status !== undefined) { // si status ve al body
        if (!validStatus.includes(status)) { // si status no es correcte
            return res.status(400).json({ error: 'Status no correcte' });
        }
        bugData.status = status;
    }


    if(Array.isArray(additional_comments) && additional_comments.length > 0){ //valid si es un array i si te comentaris

        bugData.additional_comments = additional_comments;

    }

    if(status === undefined && (!additional_comments || additional_comments.length === 0)){
        return res.status(400).json({ error: 'No hi ha res a actualitzar' });
    }

    const id = req.params.id; //agafo id dels parametres del patch

    if (!id){
        return res.status(400).json({ error: 'ID no proporcionat' });
    } 


    const editedBug = await editDBBug(bugData, id);
    return res.status(200).json(editedBug);
}