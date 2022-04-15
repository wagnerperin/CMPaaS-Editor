import splitInstanceRel from "./splitInstanceRel.js";
const validateLinks = (fromnode, _, tonode, __) => {
    if(fromnode.data.category === "relation"){
        if(tonode.data.category=== "concept" || tonode.data.category === "map" || tonode.data.category === "instance") return true;
        else return false;
    }else if(fromnode.data.category === "instanceRel"){
        if(tonode.data.category !== "instance") return false;
        else{
            let instanceRel = splitInstanceRel(fromnode.data);
            console.log(instanceRel);
            let candidateMetaConcepts = tonode.data.metaConcepts.filter(mc => mc.split("::")[0] === instanceRel.modelName).map(mc => {
                let split = mc.split("::");
                return {
                    modelName: split[0],
                    id: split[1]
                }
            });
            let metaModel = go.Model.fromJson(JSON.parse(localStorage.getItem('metaModels')).find(mm => mm.name == instanceRel.modelName).model);
            let validMetaConcepts = candidateMetaConcepts.filter(cmc => metaModel.linkDataArray.some(l => (l.from == instanceRel.id && l.to == cmc.id)));
            if(validMetaConcepts.length > 0) return true;
            else return false
        }
    }
}
export default validateLinks;