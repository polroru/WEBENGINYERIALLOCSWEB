import { mongodbInstance } from "../infrastructure/mongodb-connection.js";
import { ObjectId } from 'mongodb';

const bugSchema = new mongodbInstance.Schema({
    bug_description: String,
    reproduction_steps: String,
    severity:{
        type: Number,
        min: 1,
        max: 10,
        required: true
    },
    additional_comments: [String],
    status:{
        type: String,
        enum: ['Open', 'Work in progress', 'Solved'],
        default: 'Open'
    }
},
{
    timestamps: true
});


export const bugMongooseModel = mongodbInstance.model('Bug', bugSchema);

//funcio per trobar bug mitjançant id
export async function getDBBug(id){

  if (!ObjectId.isValid(id)) {
    return null;
  }
    const bug = await bugMongooseModel.findOne({ _id: new ObjectId(id)});
    return bug;

}


//funcio que retorna tots els bugs
export async function getAllDBBugs(filtres){


    /*                      FILTRES MONGODB
        *per buscar per un camp: 
                        db.collection.find({ x : z}), 
                        
                        x --> camp (pot ser qualsevol tipus de camp)
                        z -->   
    
    */

    const query = {};
    let ordenar = {};
        //primer comprovem si hi ha filtre per status (si no hi ha no s'aplica);
    if(filtres.status){
        query.status = filtres.status;
    }


    
    if (filtres.ordenarData === 'asc') {
        ordenar.createdAt = 1;  // Primer la mes antiga
    } else if(filtres.ordenarData === 'desc'){
        ordenar.createdAt = -1; // Primer la mes recent
    }
    
    if (filtres.ordenarSeveritat === 'asc') {
        ordenar.severity = 1;  // Menor a major
    } else if (filtres.ordenarSeveritat === 'desc') {
        ordenar.severity = -1; // Major a menor
    }

    /*
                APLIQUEM EL FILTRE
    */
    const bugs = await bugMongooseModel.find(query).sort(ordenar); //retorna tots els objectes ("bugs") sense cap mena de discriminacio
    const bugsIdStrings = bugs.map(bug => ({ //he de transformar tots els objectId a Strings
        ...bug.toObject(),
        _id: bug._id.toString()
    }));
    return bugsIdStrings;
}

//funcio per afegir un bug
export async function addDBBug(bugData){
    const newBug = new bugMongooseModel({
        bug_description: bugData.bug_description,
        reproduction_steps: bugData.reproduction_steps,
        severity: bugData.severity,
        additional_comments: bugData.additional_comments || [], // si no hi ha comentari es queda buit (l'array)
    })
    await newBug.save();
    return newBug;
}

//funcio per editar estat d'un bug
export async function editDBBug(bugData, id){
    const updatedBug = await bugMongooseModel.findOneAndUpdate(
        {_id: new ObjectId(id)},
        {
                additional_comments: bugData.additional_comments, 
                status: bugData.status
        },
        { new: true } //retornem objecte actualitzrt
    );

    if (!updatedBug) {
        // bug es inexistent
        return null;
    }

    return {
        ...updatedBug.toObject(),
        _id: updatedBug._id.toString() //retorno en format string
    };
}