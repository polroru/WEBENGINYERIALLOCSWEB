import {getDBBug, getAllDBBugs, addDBBug, editDBBug } from "../models/bug_model.js";




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

        //creem status valids
    const validStatuses = ['Open', 'Work in progress', 'Solved'];
    const validOrdenar = ['asc', 'desc'];
    
        //comprovem que hi ha algo o 
    if (filtres.status && !validStatuses.includes(filtres.status)) {
        return res.status(400).json({ error: 'Status no vàlid. Usa: Open, Work in progress o Solved' });
    }
    
        // Validar ordenarData (asc o desc)
    if (filtres.ordenarData && !validOrdenar.includes(filtres.ordenarData)) {
        return res.status(400).json({ error: 'ordenarData no vàlid. Usa: 0 o 1' });
    }
    
        // Validar ordenarSeveritat (asc o desc)
    if (filtres.ordenarSeveritat && validOrdenar.includes(filtres.ordenarSeveritat)) {
        return res.status(400).json({ error: 'ordenarSeveritat no vàlid. Usa: 0 o 1' });
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



    if (!bugData.bug_description || !bugData.reproduction_steps || !bugData.severity){
        return res.status(400).json({ error: 'Falten dades' });
    }else if(bugData.severity < 1 || bugData.severity > 10)
    {
        return res.status(400).json({ error: 'Severitat fora del rang de 1 a 10'});
    }
    console.log("Nou bug afegit");
    const newBug = await addDBBug(bugData);
    return res.status(201).json(newBug);
}



//funcio per editar bug existent
export async function editBug(req,res){

    const { bug_description, reproduction_steps, severity, additional_comments, status } = req.body;
    
        // D'aquesdta forma ens asegurem que no canviin camps que no s'han de tocar

    const bugData = {
        bug_description,
        reproduction_steps,
        severity,
        additional_comments: additional_comments || [],
        status: status || 'Open'
    };

    const id = req.params.id; //agafo id dels parametres del patch
    if (!bugData.bug_description && !bugData.reproduction_steps && !bugData.severity){
        return res.status(400).json({ error: 'Falten dades' });
    }else if(bugData.severity < 1 || bugData.severity > 10)
    {
        return res.status(400).json({ error: 'Severitat fora del rang de 1 a 10'});
    }
    const editedBug = await editDBBug(bugData, id);
    return res.status(200).json(editedBug);
}