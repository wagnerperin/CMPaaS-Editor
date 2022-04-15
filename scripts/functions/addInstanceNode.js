import splitInstanceRel from "./splitInstanceRel.js";

const addInstanceNode = (e, obj) => {
    const metaRel = splitInstanceRel(obj.part.adornedPart.data)

    const metaModel = go.Model.fromJson(JSON.parse(localStorage.getItem('metaModels')).find(mm => mm.name == metaRel.modelName).model);
    
    const loc = obj.part.adornedPart.location.copy();
    loc.y += 60;

    const metaConcepts = metaModel.linkDataArray.filter(l => l.from == metaRel.id).map(l => l.to).map(tid => metaRel.modelName+"::"+tid);
   
    const newConcept = {
        text: 'New Instance Concept',
        category: 'instance',
        loc: go.Point.stringify(loc),
        metaConcepts
    }

    e.diagram.startTransaction("Add Instance Relation");

    e.diagram.model.addNodeData(newConcept);
    const genId = e.diagram.model.getKeyForNodeData(newConcept);

    const newLink = {
        from: obj.part.adornedPart.data.key,
        to: genId
    }

    e.diagram.model.addLinkData(newLink);
    e.diagram.select(e.diagram.findNodeForKey(genId));

    e.diagram.commitTransaction("Add Instance Relation");

    
    

};

export default addInstanceNode;