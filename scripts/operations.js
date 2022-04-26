const test = (e) => {
    let metaModels = JSON.parse(localStorage.getItem('metaModels'));
    diagram.model = go.Model.fromJson(metaModels.find(mm => mm.name == e.srcElement.id).model);
    metaModels = metaModels.filter(mm => mm.name != e.srcElement.id);
    localStorage.setItem('metaModels', JSON.stringify(metaModels));
}
const loadMetaModels = () => {
    let div = document.getElementById('selectMetaModel');
    const metaModels = JSON.parse(localStorage.getItem('metaModels'));
    metaModels.forEach(mm => {
        let link = document.createElement("a");
        link.appendChild(document.createTextNode(mm.name));
        link.id = mm.name;
        link.href='#';
        link.onclick = test;
        div.appendChild(link);
    });
}
const loadMetaConcepts = () => {
    const metaModels = JSON.parse(localStorage.getItem('metaModels'));
    let knownConcepts = new Array();

    metaModels.forEach(metaModel => {
        const model = JSON.parse(metaModel.model);
        knownConcepts = model.nodeDataArray.filter(node => {
            node.metaModel = metaModel.name;
            return (node.category === "concept" || node.category === "map");
        }).concat(knownConcepts);
    });
    let select = document.getElementById('selectMetaModelConcept');

    knownConcepts.forEach(concept => {
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = concept.metaModel + "::" + concept.text;
        checkbox.name = 'knownConcepts';
        checkbox.value = concept.metaModel + "::" + concept.key;

        checkbox.onchange = (e) => {
            let selectedNode = diagram.selection.first();
            if(selectedNode && (selectedNode.data.category === "concept" || selectedNode.data.category === "instance" || selectedNode.data.category === "map"))
                diagram.model.commit(m => {
                    let nodeMetaConcepts = selectedNode.data.metaConcepts || new Array();
                    if(e.target.checked && !nodeMetaConcepts.includes(e.target.value)){
                        nodeMetaConcepts.push(e.target.value);
                    }else if(!e.target.checked && nodeMetaConcepts.includes(e.target.value)){
                        nodeMetaConcepts = nodeMetaConcepts.filter(mc => mc != e.target.value);
                    }
                    m.set(selectedNode.data, "metaConcepts", nodeMetaConcepts);
                    m.set(selectedNode.data, "category", nodeMetaConcepts.length > 0 ? "instance": "concept");
                    //console.log(selectedNode.data);
                });
            else e.target.checked = false;
        }

        select.appendChild(checkbox);

        let label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.appendChild(document.createTextNode(checkbox.id));

        select.appendChild(label);
        select.appendChild(document.createElement("br"));
        
    });

    diagram.addDiagramListener("ChangedSelection", function(e) {
        let boxes = document.getElementsByName("knownConcepts");
        let selectedNode = diagram.selection.first();
        if(selectedNode)
            boxes.forEach(box => {
                if(selectedNode.data.metaConcepts && selectedNode.data.metaConcepts.includes(box.value)){
                    box.checked = true;
                }else box.checked = false;
            });
    });
}
const saveMetaModel = () => {
    const name = prompt("Nome do Modelo: ");
    const metamodels = localStorage.getItem('metaModels') !== null ? JSON.parse(localStorage.getItem('metaModels')) : new Array();
    metamodels.push({
        name,
        model: diagram.model.toJson()
    });
    localStorage.setItem('metaModels', JSON.stringify(metamodels));
    document.location.reload(true);
};

const deleteMetaModels = () => {
    localStorage.removeItem('metaModels');
    document.location.reload(true);
};

const kanbanPerspective = () => {
    document.getElementById('myDiagramDiv').style.display = 'none';
    document.getElementById('myDiagramDiv2').style.display = 'block';
}

const mapPerspective = () => {
    document.getElementById('myDiagramDiv').style.display = 'block';
    document.getElementById('myDiagramDiv2').style.display = 'none';

}

const saveModel = () => {
    localStorage.setItem('model', diagram.model.toJson());
    document.location.reload(true);
}

const loadModel = () => {
    diagram.model = go.Model.fromJson(JSON.parse(localStorage.getItem('model')));
}