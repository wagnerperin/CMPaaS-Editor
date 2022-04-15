const addInstanceRelation = (e, obj) => {
    let metaRelations = new Array();

    obj.part.adornedPart.data.metaConcepts.forEach(mc => {
        let mcExploded = mc.split("::");
        let metaModel = go.Model.fromJson(JSON.parse(localStorage.getItem('metaModels')).find(mm => mm.name == mcExploded[0]).model);
        let relIds = metaModel.linkDataArray.filter(l => l.from == mcExploded[1]).map(l => l.to);
        relIds.forEach(id => {
            metaRelations.push({
                modelName: mcExploded[0],
                id,
                text: metaModel.findNodeDataForKey(id).text
            })
        });
    });

    e.diagram.startTransaction("Add Instance Relation");

    const loc = obj.part.adornedPart.location.copy();
    loc.y += 60;

    let choices = new Array();

    choices = metaRelations.map((mr, _, array) => {
        let count = array.reduce((count, cur, _, __) => {
            if(cur.text == mr.text) return count+=1;
            return count;
        }, 0);
        if(count > 1) return mr.modelName+"::"+mr.text+"::"+mr.id;
        else return mr.modelName+"::"+mr.text;
    })

    const newRel = {
        text: choices[0],
        category: 'instanceRel',
        loc: go.Point.stringify(loc),
        choices,
        metaRelations
    }

    e.diagram.model.addNodeData(newRel);
    const genId = e.diagram.model.getKeyForNodeData(newRel);

    const newLink = {
        from: obj.part.adornedPart.data.key,
        to: genId
    }

    e.diagram.model.addLinkData(newLink);
    e.diagram.select(e.diagram.findNodeForKey(genId));

    e.diagram.commitTransaction("Add Instance Relation");
};

export default addInstanceRelation;