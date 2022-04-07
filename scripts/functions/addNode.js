
const addNode = (e, obj) => {
    const diagram = e.diagram;
    diagram.startTransaction("Add Concept");

    const fromNode = obj.part.adornedPart;
    const fromData = fromNode.data;

    const loc = fromNode.location.copy();
    loc.x += 120;
    loc.y += (fromNode.category === "concept" || fromNode.category === "map") ? 4 : -4;

    const newNode = {
        text: (fromNode.category === "concept" || fromNode.category === "map") ? 'New Relation' : 'New Concept',
        category: (fromNode.category === "concept" || fromNode.category === "map") ? 'relation' : 'concept',
        loc: go.Point.stringify(loc)
    }
    diagram.model.addNodeData(newNode);

    const genId = diagram.model.getKeyForNodeData(newNode);

    const newLink = {
        from: fromData.key,
        to: genId
    }

    diagram.model.addLinkData(newLink);

    diagram.select(diagram.findNodeForKey(genId));

    diagram.commitTransaction("Add Concept");

};

export default addNode;