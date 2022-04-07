const loadMetaModels = () => {
    const metaModels = JSON.parse(localStorage.getItem('metaModels'));
    let knownConcepts = new Array();

    metaModels.forEach(metaModel => {
        const model = JSON.parse(metaModel.model);
        knownConcepts = model.nodeDataArray.filter(node => {
            node.metaModel = metaModel.name;
            return node.category === "concept";
        }).concat(knownConcepts);
    });

    let select = document.getElementById('selectMetaModelConcept');

    knownConcepts.forEach(concept => {
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = concept.metaModel + "::" + concept.text;
        checkbox.name = 'knownConcepts';
        checkbox.value = checkbox.id;

        checkbox.onchange = (e) => {
            let selectedNode = diagram.selection.first();
            if(selectedNode && (selectedNode.data.category === "concept" || selectedNode.data.category === "instance"))
                diagram.model.commit(m => {
                    let selectedConcept = diagram.selection.first();
                    let metaConcepts = selectedConcept.data.metaConcepts || new Array();
                    if(e.target.checked && !metaConcepts.includes(e.target.value)) metaConcepts.push(e.target.value);
                    else if (!e.target.checked && metaConcepts.includes(e.target.value)) metaConcepts = metaConcepts.filter(mc => mc != e.target.value);

                    m.set(selectedConcept.data, "metaConcepts", metaConcepts);
                    m.set(selectedConcept.data, "category", metaConcepts.length > 0 ? "instance" : "concept");


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
                if(selectedNode.data.metaConcepts && selectedNode.data.metaConcepts.includes(box.id)){
                    box.checked = true;
                }else box.checked = false;
            });
    })
}
const saveMetaModel = () => {
    const name = prompt("Nome do Modelo: ");
    const metamodels = localStorage.getItem('metaModels') !== null ? JSON.parse(localStorage.getItem('metaModels')) : new Array();
    metamodels.push({
        name,
        model: diagram.model.toJson()
    });
    localStorage.setItem('metaModels', JSON.stringify(metamodels));
};