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
        div.appendChild(document.createElement("br"));
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
    let select = document.getElementById('selectMetaConcepts');

    knownConcepts.forEach(concept => {
        let internalSpan = document.createElement('span');
        internalSpan.classList.add('check');

        let externalSpan = document.createElement('span');
        externalSpan.classList.add('form-check-sign');

        externalSpan.appendChild(internalSpan);

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = concept.metaModel + "::" + concept.text;
        checkbox.name = 'knownConcepts';
        checkbox.value = concept.metaModel + "::" + concept.key;
        checkbox.classList.add('form-check-input')

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

        let lbl = document.createElement('label');
        lbl.classList.add('form-check-label');
        const textnode = document.createTextNode(concept.metaModel + "::" + concept.text);
        lbl.appendChild(checkbox);
        lbl.appendChild(textnode);
        lbl.appendChild(externalSpan);

        let newDiv = document.createElement('div');
        newDiv.classList.add('form-check');
        newDiv.appendChild(lbl);

        let a = document.createElement('a');
        a.setAttribute('href', 'javascript:void(0)');
        a.setAttribute('class', 'switch-trigger');

        a.appendChild(newDiv);
        select.appendChild(a);
        
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
    saveModel();
    window.location.href = "kanban.html";
}

const ERPerspective = () => {
    saveModel();
    window.location.href = "er.html";
}

const saveModel = () => {
    localStorage.setItem('model', diagram.model.toJson());
    document.location.reload(true);
}

const loadModel = () => {
    diagram.model = go.Model.fromJson(JSON.parse(localStorage.getItem('model')));
}

const loadArticleSamples = () => {
    localStorage.setItem("model", JSON.stringify({ "class": "go.GraphLinksModel",
    "nodeDataArray": [ 
  {"text":"XXX Project", "category":"instance", "key":-1, "loc":"-54 96", "metaConcepts":[ "Project Manager Perspective::-1","Developer Perspective::-1","Research Professor Perspective::-1","Architect Perspective::-1","Client Perspective::-1","KanBan Perspective::-1" ]},
  {"text":"Research Professor Perspective::has::-2", "category":"instanceRel", "loc":"-156.7029010058984 135.22544556210937", "choices":[ "Project Manager Perspective::has::-2","Developer Perspective::has::-2","Research Professor Perspective::has::-2","Architect Perspective::has::-2","Client Perspective::has::-2","KanBan Perspective::has::-2" ], "metaRelations":[ {"modelName":"Project Manager Perspective", "id":-2, "text":"has"},{"modelName":"Developer Perspective", "id":-2, "text":"has"},{"modelName":"Research Professor Perspective", "id":-2, "text":"has"},{"modelName":"Architect Perspective", "id":-2, "text":"has"},{"modelName":"Client Perspective", "id":-2, "text":"has"},{"modelName":"KanBan Perspective", "id":-2, "text":"has"} ], "key":-2},
  {"text":"THIS ARTICLE AUTHOR NAME GOES HERE", "category":"instance", "loc":"-199.42432680464844 202.09017822484378", "metaConcepts":[ "Research Professor Perspective::-3","Project Manager Perspective::-8" ], "key":-3},
  {"text":"Research Professor Perspective::produces", "category":"instanceRel", "loc":"-293.9290974983079 268", "choices":[ "Research Professor Perspective::produces" ], "metaRelations":[ {"modelName":"Research Professor Perspective", "id":-5, "text":"produces"} ], "key":-4},
  {"text":"CMDD Framework", "category":"instance", "loc":"-344.162582587136 338.3421881065234", "metaConcepts":[ "Research Professor Perspective::-6" ], "key":-5},
  {"text":"THIS ARTICLE REFs GOES HERE", "category":"instance", "loc":"-93.51525595979217 327", "metaConcepts":[ "Research Professor Perspective::-7" ], "key":-6},
  {"text":"Research Professor Perspective::describes", "category":"instanceRel", "loc":"-275.9290974983079 387", "choices":[ "Research Professor Perspective::describes" ], "metaRelations":[ {"modelName":"Research Professor Perspective", "id":-8, "text":"describes"} ], "key":-7},
  {"text":"Implements a CMDD Framework", "category":"instance", "loc":"111.52254455621096 361.23348508882816", "metaConcepts":[ "Project Manager Perspective::-3" ], "key":-8},
  {"text":"Project Manager Perspective::generates", "category":"instanceRel", "loc":"85.79307923074202 409.6046832543359", "choices":[ "Project Manager Perspective::generates" ], "metaRelations":[ {"modelName":"Project Manager Perspective", "id":-5, "text":"generates"} ], "key":-9},
  {"text":"Project Manager Perspective::has::-2", "category":"instanceRel", "loc":"116.3953167456641 163.88325745558592", "choices":[ "Project Manager Perspective::has::-2","Developer Perspective::has::-2","Research Professor Perspective::has::-2","Architect Perspective::has::-2","Client Perspective::has::-2","KanBan Perspective::has::-2" ], "metaRelations":[ {"modelName":"Project Manager Perspective", "id":-2, "text":"has"},{"modelName":"Developer Perspective", "id":-2, "text":"has"},{"modelName":"Research Professor Perspective", "id":-2, "text":"has"},{"modelName":"Architect Perspective", "id":-2, "text":"has"},{"modelName":"Client Perspective", "id":-2, "text":"has"},{"modelName":"KanBan Perspective", "id":-2, "text":"has"} ], "key":-10},
  {"text":"CMDD Framework Development Team", "category":"instance", "loc":"330 231", "metaConcepts":[ "Project Manager Perspective::-4","KanBan Perspective::-4" ], "key":-11},
  {"text":"Project Manager Perspective::assume", "category":"instanceRel", "loc":"329 311", "choices":[ "Project Manager Perspective::has","Project Manager Perspective::assume" ], "metaRelations":[ {"modelName":"Project Manager Perspective", "id":-7, "text":"has"},{"modelName":"Project Manager Perspective", "id":-9, "text":"assume"} ], "key":-12},
  {"text":"Project Manager Perspective::has", "category":"instanceRel", "loc":"228.0555743785543 279.18035644968757", "choices":[ "Project Manager Perspective::has","Project Manager Perspective::assume" ], "metaRelations":[ {"modelName":"Project Manager Perspective", "id":-7, "text":"has"},{"modelName":"Project Manager Perspective", "id":-9, "text":"assume"} ], "key":-13},
  {"text":"Project Manager Perspective::coordinate", "category":"instanceRel", "loc":"-69.40824775121087 282.7745544378905", "choices":[ "Research Professor Perspective::produces","Project Manager Perspective::takes","Project Manager Perspective::coordinate" ], "metaRelations":[ {"modelName":"Research Professor Perspective", "id":-5, "text":"produces"},{"modelName":"Project Manager Perspective", "id":-10, "text":"takes"},{"modelName":"Project Manager Perspective", "id":-11, "text":"coordinate"} ], "key":-14},
  {"text":"CMDD Page Interface", "category":"instance", "key":-15, "loc":"166.95246514816415 460.9660984621877", "metaConcepts":[ "Project Manager Perspective::-6","Developer Perspective::-5","Architect Perspective::-7","Client Perspective::-3","KanBan Perspective::-6" ]},
  {"text":"Project Manager Perspective::takes", "category":"instanceRel", "loc":"-330.9178613018752 494.05068289972667", "choices":[ "Research Professor Perspective::produces","Project Manager Perspective::takes","Project Manager Perspective::coordinate" ], "metaRelations":[ {"modelName":"Research Professor Perspective", "id":-5, "text":"produces"},{"modelName":"Project Manager Perspective", "id":-10, "text":"takes"},{"modelName":"Project Manager Perspective", "id":-11, "text":"coordinate"} ], "key":-16},
  {"text":"Developer Perspective::has::-2", "category":"instanceRel", "loc":"330.1384153851568 408.6448808879298", "choices":[ "Project Manager Perspective::has::-2","Developer Perspective::has::-2","Research Professor Perspective::has::-2","Architect Perspective::has::-2","Client Perspective::has::-2","KanBan Perspective::has::-2" ], "metaRelations":[ {"modelName":"Project Manager Perspective", "id":-2, "text":"has"},{"modelName":"Developer Perspective", "id":-2, "text":"has"},{"modelName":"Research Professor Perspective", "id":-2, "text":"has"},{"modelName":"Architect Perspective", "id":-2, "text":"has"},{"modelName":"Client Perspective", "id":-2, "text":"has"},{"modelName":"KanBan Perspective", "id":-2, "text":"has"} ], "key":-17},
  {"text":"Architect Perspective::has::-2", "category":"instanceRel", "loc":"248.8783659767579 104.28905946738274", "choices":[ "Project Manager Perspective::has::-2","Developer Perspective::has::-2","Research Professor Perspective::has::-2","Architect Perspective::has::-2","Client Perspective::has::-2","KanBan Perspective::has::-2" ], "metaRelations":[ {"modelName":"Project Manager Perspective", "id":-2, "text":"has"},{"modelName":"Developer Perspective", "id":-2, "text":"has"},{"modelName":"Research Professor Perspective", "id":-2, "text":"has"},{"modelName":"Architect Perspective", "id":-2, "text":"has"},{"modelName":"Client Perspective", "id":-2, "text":"has"},{"modelName":"KanBan Perspective", "id":-2, "text":"has"} ], "key":-18},
  {"text":"EC2 Server 1", "category":"instance", "loc":"601.9902170423439 242.5941979882031", "metaConcepts":[ "Architect Perspective::-3" ], "key":-19},
  {"text":"Architect Perspective::hosts", "category":"instanceRel", "loc":"519.5165834032035 357.3162057971484", "choices":[ "Architect Perspective::hosts" ], "metaRelations":[ {"modelName":"Architect Perspective", "id":-4, "text":"hosts"} ], "key":-20},
  {"text":"Client Perspective::has::-2", "category":"instanceRel", "loc":"411.3984647935547 457.4009105329689", "choices":[ "Project Manager Perspective::has::-2","Developer Perspective::has::-2","Research Professor Perspective::has::-2","Architect Perspective::has::-2","Client Perspective::has::-2","KanBan Perspective::has::-2" ], "metaRelations":[ {"modelName":"Project Manager Perspective", "id":-2, "text":"has"},{"modelName":"Developer Perspective", "id":-2, "text":"has"},{"modelName":"Research Professor Perspective", "id":-2, "text":"has"},{"modelName":"Architect Perspective", "id":-2, "text":"has"},{"modelName":"Client Perspective", "id":-2, "text":"has"},{"modelName":"KanBan Perspective", "id":-2, "text":"has"} ], "key":-21},
  {"text":"KanBan Perspective::has::-2", "category":"instanceRel", "loc":"-350.9685442016018 122.01852479285151", "choices":[ "Project Manager Perspective::has::-2","Developer Perspective::has::-2","Research Professor Perspective::has::-2","Architect Perspective::has::-2","Client Perspective::has::-2","KanBan Perspective::has::-2" ], "metaRelations":[ {"modelName":"Project Manager Perspective", "id":-2, "text":"has"},{"modelName":"Developer Perspective", "id":-2, "text":"has"},{"modelName":"Research Professor Perspective", "id":-2, "text":"has"},{"modelName":"Architect Perspective", "id":-2, "text":"has"},{"modelName":"Client Perspective", "id":-2, "text":"has"},{"modelName":"KanBan Perspective", "id":-2, "text":"has"} ], "key":-22},
  {"text":"Release 1", "category":"instance", "loc":"-561.6973074083206 223.18610333765622", "metaConcepts":[ "KanBan Perspective::-3" ], "key":-23},
  {"text":"Grooming", "category":"instance", "loc":"-537.1279301190237 269.18839597640624", "metaConcepts":[ "KanBan Perspective::-5" ], "key":-24},
  {"text":"Project Backlog", "category":"instance", "loc":"-534.1730192314456 322.37679195281254", "metaConcepts":[ "KanBan Perspective::-5" ], "key":-25},
  {"text":"In Progress", "category":"instance", "loc":"-489.84935591777366 372.61027704164064", "metaConcepts":[ "KanBan Perspective::-5" ], "key":-26},
  {"text":"Testing", "category":"instance", "loc":"-449.958058935469 425.798673018047", "metaConcepts":[ "KanBan Perspective::-5" ], "key":-27},
  {"text":"Done", "category":"instance", "loc":"-426.318771834844 481.9419798820313", "metaConcepts":[ "KanBan Perspective::-5" ], "key":-28},
  {"text":"KanBan Perspective::is in", "category":"instanceRel", "loc":"-585.0723557404692 515.0562766870314", "choices":[ "Developer Perspective::has::-6","Architect Perspective::made requests","Client Perspective::has::-6","KanBan Perspective::is in" ], "metaRelations":[ {"modelName":"Developer Perspective", "id":-6, "text":"has"},{"modelName":"Architect Perspective", "id":-8, "text":"made requests"},{"modelName":"Client Perspective", "id":-6, "text":"has"},{"modelName":"KanBan Perspective", "id":-7, "text":"is in"} ], "key":-29},
  {"text":"Concept Map Editor", "category":"instance", "loc":"-194.67347121526086 524.8727721894533", "metaConcepts":[ "Project Manager Perspective::-6","KanBan Perspective::-6" ], "key":-30},
  {"text":"KanBan Perspective::is in", "category":"instanceRel", "loc":"-364.8308311249224 562.1087030176953", "choices":[ "KanBan Perspective::is in" ], "metaRelations":[ {"modelName":"KanBan Perspective", "id":-7, "text":"is in"} ], "key":-31},
  {"text":"KanBan Editor", "category":"instance", "loc":"-149.1223363317191 621.7825939646095", "metaConcepts":[ "Project Manager Perspective::-6","KanBan Perspective::-6" ], "key":-32},
  {"text":"KanBan Perspective::is in", "category":"instanceRel", "loc":"-605.6560684625396 570.9734356804296", "choices":[ "KanBan Perspective::is in" ], "metaRelations":[ {"modelName":"KanBan Perspective", "id":-7, "text":"is in"} ], "key":-33}
   ],
    "linkDataArray": [ 
  {"from":-1, "to":-2},
  {"from":-2, "to":-3},
  {"from":-3, "to":-4},
  {"from":-4, "to":-5},
  {"from":-4, "to":-6},
  {"from":-6, "to":-7},
  {"category":"normal", "from":-7, "to":-5},
  {"from":-8, "to":-9},
  {"from":-1, "to":-10},
  {"category":"normal", "from":-10, "to":-8},
  {"from":-10, "to":-11},
  {"from":-11, "to":-12},
  {"category":"normal", "from":-12, "to":-8},
  {"from":-11, "to":-13},
  {"category":"normal", "from":-13, "to":-3},
  {"from":-3, "to":-14},
  {"category":"normal", "from":-14, "to":-8},
  {"from":-3, "to":-16},
  {"category":"normal", "from":-9, "to":-15},
  {"category":"normal", "from":-16, "to":-15},
  {"from":-1, "to":-17},
  {"category":"normal", "from":-17, "to":-15},
  {"from":-1, "to":-18},
  {"from":-18, "to":-19},
  {"from":-19, "to":-20},
  {"category":"normal", "from":-20, "to":-15},
  {"from":-1, "to":-21},
  {"category":"normal", "from":-21, "to":-15},
  {"from":-1, "to":-22},
  {"from":-22, "to":-23},
  {"category":"normal", "from":-22, "to":-11},
  {"from":-22, "to":-24},
  {"from":-22, "to":-25},
  {"from":-22, "to":-26},
  {"from":-22, "to":-27},
  {"from":-22, "to":-28},
  {"from":-15, "to":-29},
  {"category":"normal", "from":-29, "to":-26},
  {"from":-9, "to":-30},
  {"from":-30, "to":-31},
  {"category":"normal", "from":-31, "to":-28},
  {"from":-9, "to":-32},
  {"from":-32, "to":-33},
  {"category":"normal", "from":-33, "to":-26},
  {"category":"normal", "from":-22, "to":-30},
  {"category":"normal", "from":-22, "to":-32}
   ]}));
   localStorage.setItem("metaModels", JSON.stringify([{"name":"KanBan Perspective","model":"{ \"class\": \"go.GraphLinksModel\",\n  \"nodeDataArray\": [ \n{\"text\":\"Project\", \"category\":\"concept\", \"key\":-1, \"loc\":\"-166 -118\"},\n{\"text\":\"has\", \"category\":\"relation\", \"loc\":\"-156 -69\", \"key\":-2},\n{\"text\":\"Release\", \"category\":\"concept\", \"loc\":\"-240 -70\", \"key\":-3},\n{\"text\":\"Team\", \"category\":\"concept\", \"loc\":\"-161 15\", \"key\":-4},\n{\"text\":\"Development Stage\", \"category\":\"concept\", \"loc\":\"-67 -69\", \"key\":-5},\n{\"text\":\"Tasks\", \"category\":\"concept\", \"loc\":\"-35 15\", \"key\":-6},\n{\"text\":\"is in\", \"category\":\"relation\", \"loc\":\"-28 -26\", \"key\":-7},\n{\"text\":\"takes\", \"category\":\"relation\", \"loc\":\"-97 15\", \"key\":-8}\n ],\n  \"linkDataArray\": [ \n{\"from\":-1, \"to\":-2},\n{\"from\":-2, \"to\":-3},\n{\"from\":-2, \"to\":-4},\n{\"from\":-2, \"to\":-5},\n{\"from\":-2, \"to\":-6},\n{\"from\":-6, \"to\":-7},\n{\"category\":\"normal\", \"from\":-7, \"to\":-5},\n{\"from\":-4, \"to\":-8},\n{\"category\":\"normal\", \"from\":-8, \"to\":-6}\n ]}"},{"name":"Client Perspective","model":"{ \"class\": \"go.GraphLinksModel\",\n  \"nodeDataArray\": [ \n{\"text\":\"Web Project\", \"category\":\"concept\", \"key\":-1, \"loc\":\"-116 -157\"},\n{\"text\":\"has\", \"category\":\"relation\", \"loc\":\"-92 -107\", \"key\":-2},\n{\"text\":\"Page\", \"category\":\"concept\", \"loc\":\"28 -107\", \"key\":-3},\n{\"text\":\"Functionality\", \"category\":\"concept\", \"loc\":\"27 -58\", \"key\":-4},\n{\"text\":\"Database\", \"category\":\"concept\", \"loc\":\"36 58\", \"key\":-5},\n{\"text\":\"has\", \"category\":\"relation\", \"loc\":\"148 -107\", \"key\":-6},\n{\"text\":\"Components\", \"category\":\"concept\", \"loc\":\"268 -135\", \"key\":-7},\n{\"text\":\"Forms\", \"category\":\"concept\", \"loc\":\"270 -98\", \"key\":-8},\n{\"text\":\"Buttons\", \"category\":\"concept\", \"loc\":\"270 -58\", \"key\":-9},\n{\"text\":\"executes\", \"category\":\"relation\", \"loc\":\"151 -57\", \"key\":-10},\n{\"text\":\"has\", \"category\":\"relation\", \"loc\":\"390 -98\", \"key\":-11},\n{\"text\":\"shows\", \"category\":\"relation\", \"loc\":\"388 -135\", \"key\":-12},\n{\"text\":\"Informations\", \"category\":\"concept\", \"loc\":\"508 -135\", \"key\":-13},\n{\"text\":\"generates\", \"category\":\"relation\", \"loc\":\"179 5\", \"key\":-14},\n{\"text\":\"interact with\", \"category\":\"relation\", \"loc\":\"30 -13\", \"key\":-15}\n ],\n  \"linkDataArray\": [ \n{\"from\":-1, \"to\":-2},\n{\"from\":-2, \"to\":-3},\n{\"from\":-2, \"to\":-4},\n{\"from\":-2, \"to\":-5},\n{\"from\":-3, \"to\":-6},\n{\"from\":-6, \"to\":-7},\n{\"from\":-6, \"to\":-8},\n{\"from\":-6, \"to\":-9},\n{\"from\":-9, \"to\":-10},\n{\"category\":\"normal\", \"from\":-10, \"to\":-4},\n{\"from\":-8, \"to\":-11},\n{\"category\":\"normal\", \"from\":-11, \"to\":-9},\n{\"from\":-7, \"to\":-12},\n{\"from\":-12, \"to\":-13},\n{\"from\":-4, \"to\":-14},\n{\"category\":\"normal\", \"from\":-14, \"to\":-13},\n{\"from\":-4, \"to\":-15},\n{\"category\":\"normal\", \"from\":-15, \"to\":-5}\n ]}"},{"name":"Architect Perspective","model":"{ \"class\": \"go.GraphLinksModel\",\n  \"nodeDataArray\": [ \n{\"text\":\"Web Project\", \"category\":\"concept\", \"key\":-1, \"loc\":\"-59 -149\"},\n{\"text\":\"has\", \"category\":\"relation\", \"loc\":\"61 -149\", \"key\":-2},\n{\"text\":\"Server\", \"category\":\"concept\", \"loc\":\"134 -148\", \"key\":-3},\n{\"text\":\"hosts\", \"category\":\"relation\", \"loc\":\"137 -94\", \"key\":-4},\n{\"text\":\"Database\", \"category\":\"concept\", \"loc\":\"257 -94\", \"key\":-5},\n{\"text\":\"Back-End Service\", \"category\":\"concept\", \"loc\":\"102 -29\", \"key\":-6},\n{\"text\":\"Front-End Page\", \"category\":\"concept\", \"loc\":\"-94 -94\", \"key\":-7},\n{\"text\":\"made requests\", \"category\":\"relation\", \"loc\":\"-89 -27\", \"key\":-8},\n{\"text\":\"send responses\", \"category\":\"relation\", \"loc\":\"34 -66\", \"key\":-9},\n{\"text\":\"made requests\", \"category\":\"relation\", \"loc\":\"247 -29\", \"key\":-10}\n ],\n  \"linkDataArray\": [ \n{\"from\":-1, \"to\":-2},\n{\"from\":-2, \"to\":-3},\n{\"from\":-3, \"to\":-4},\n{\"from\":-4, \"to\":-5},\n{\"from\":-4, \"to\":-6},\n{\"from\":-4, \"to\":-7},\n{\"from\":-7, \"to\":-8},\n{\"category\":\"normal\", \"from\":-8, \"to\":-6},\n{\"from\":-6, \"to\":-9},\n{\"category\":\"normal\", \"from\":-9, \"to\":-7},\n{\"from\":-6, \"to\":-10},\n{\"category\":\"normal\", \"from\":-10, \"to\":-5}\n ]}"},{"name":"Research Professor Perspective","model":"{ \"class\": \"go.GraphLinksModel\",\n  \"nodeDataArray\": [ \n{\"text\":\"Project\", \"category\":\"concept\", \"key\":-1, \"loc\":\"9 -127\"},\n{\"text\":\"has\", \"category\":\"relation\", \"loc\":\"18 -72\", \"key\":-2},\n{\"text\":\"Responsible Researcher\", \"category\":\"concept\", \"loc\":\"-108 -28\", \"key\":-3},\n{\"text\":\"Auxiliary Undergraduate\", \"category\":\"concept\", \"loc\":\"78 -30\", \"key\":-4},\n{\"text\":\"produces\", \"category\":\"relation\", \"loc\":\"7 26\", \"key\":-5},\n{\"text\":\"Solution\", \"category\":\"concept\", \"loc\":\"102 73\", \"key\":-6},\n{\"text\":\"Publication\", \"category\":\"concept\", \"loc\":\"-117 73\", \"key\":-7},\n{\"text\":\"describes\", \"category\":\"relation\", \"loc\":\"3 73\", \"key\":-8}\n ],\n  \"linkDataArray\": [ \n{\"from\":-1, \"to\":-2},\n{\"from\":-2, \"to\":-3},\n{\"from\":-2, \"to\":-4},\n{\"from\":-3, \"to\":-5},\n{\"category\":\"normal\", \"from\":-4, \"to\":-5},\n{\"from\":-5, \"to\":-6},\n{\"from\":-5, \"to\":-7},\n{\"from\":-7, \"to\":-8},\n{\"category\":\"normal\", \"from\":-8, \"to\":-6}\n ]}"},{"name":"Developer Perspective","model":"{ \"class\": \"go.GraphLinksModel\",\n  \"nodeDataArray\": [ \n{\"text\":\"Web Project\", \"category\":\"concept\", \"key\":-1, \"loc\":\"-124 92\"},\n{\"text\":\"has\", \"category\":\"relation\", \"loc\":\"-125 158\", \"key\":-2},\n{\"text\":\"Database\", \"category\":\"concept\", \"loc\":\"8 157\", \"key\":-3},\n{\"text\":\"Back-End WebService\", \"category\":\"concept\", \"loc\":\"42 272\", \"key\":-4},\n{\"text\":\"Front-End Page\", \"category\":\"concept\", \"loc\":\"-213 222\", \"key\":-5},\n{\"text\":\"has\", \"category\":\"relation\", \"loc\":\"-205 288\", \"key\":-6},\n{\"text\":\"Web Component\", \"category\":\"concept\", \"loc\":\"-229 340\", \"key\":-7},\n{\"text\":\"made requests\", \"category\":\"relation\", \"loc\":\"-43 340\", \"key\":-8},\n{\"text\":\"send responses\", \"category\":\"relation\", \"loc\":\"-112 277\", \"key\":-9},\n{\"text\":\"send requests\", \"category\":\"relation\", \"loc\":\"67 204\", \"key\":-10}\n ],\n  \"linkDataArray\": [ \n{\"from\":-1, \"to\":-2},\n{\"from\":-2, \"to\":-3},\n{\"from\":-2, \"to\":-4},\n{\"from\":-2, \"to\":-5},\n{\"from\":-5, \"to\":-6},\n{\"from\":-6, \"to\":-7},\n{\"from\":-7, \"to\":-8},\n{\"category\":\"normal\", \"from\":-8, \"to\":-4},\n{\"category\":\"normal\", \"from\":-4, \"to\":-8},\n{\"from\":-4, \"to\":-9},\n{\"category\":\"normal\", \"from\":-9, \"to\":-7},\n{\"category\":\"normal\", \"from\":-9, \"to\":-4},\n{\"from\":-4, \"to\":-10},\n{\"category\":\"normal\", \"from\":-10, \"to\":-3}\n ]}"},{"name":"Project Manager Perspective","model":"{ \"class\": \"go.GraphLinksModel\",\n  \"nodeDataArray\": [ \n{\"text\":\"Project\", \"category\":\"concept\", \"key\":-1, \"loc\":\"-75 -104\"},\n{\"text\":\"has\", \"category\":\"relation\", \"loc\":\"-66 -57\", \"key\":-2},\n{\"text\":\"Storie\", \"category\":\"concept\", \"loc\":\"-152 -9\", \"key\":-3},\n{\"text\":\"Team\", \"category\":\"concept\", \"loc\":\"2 -6\", \"key\":-4},\n{\"text\":\"generates\", \"category\":\"relation\", \"loc\":\"-165 50\", \"key\":-5},\n{\"text\":\"Task\", \"category\":\"concept\", \"loc\":\"-152 102\", \"key\":-6},\n{\"text\":\"has\", \"category\":\"relation\", \"loc\":\"7 48\", \"key\":-7},\n{\"text\":\"Member\", \"category\":\"concept\", \"loc\":\"-5 102\", \"key\":-8},\n{\"text\":\"assume\", \"category\":\"relation\", \"loc\":\"-84 -5\", \"key\":-9},\n{\"text\":\"takes\", \"category\":\"relation\", \"loc\":\"-78 104\", \"key\":-10},\n{\"text\":\"coordinate\", \"category\":\"relation\", \"loc\":\"-91 54\", \"key\":-11}\n ],\n  \"linkDataArray\": [ \n{\"from\":-1, \"to\":-2},\n{\"from\":-2, \"to\":-3},\n{\"from\":-2, \"to\":-4},\n{\"from\":-3, \"to\":-5},\n{\"from\":-5, \"to\":-6},\n{\"from\":-4, \"to\":-7},\n{\"from\":-7, \"to\":-8},\n{\"from\":-4, \"to\":-9},\n{\"category\":\"normal\", \"from\":-9, \"to\":-3},\n{\"from\":-8, \"to\":-10},\n{\"category\":\"normal\", \"from\":-10, \"to\":-6},\n{\"from\":-8, \"to\":-11},\n{\"category\":\"normal\", \"from\":-11, \"to\":-3}\n ]}"}]));
   location.reload();
}