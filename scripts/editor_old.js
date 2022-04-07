let conceptNodeTemplate, relationNodeTemplate, normalLinkTemplate, orLinkTemplate, mapTemplate, selectionAdornmentTemplate;
const $ = go.GraphObject.make;

const makeButton = (text, action, visiblePredicate) => {
    return $("ContextMenuButton",
        $(go.TextBlock, text),
        { click: action },
        visiblePredicate ? new go.Binding("visible", "", function(o, e) { return o.diagram ? visiblePredicate(o, e) : false; }).ofObject() : {});
}

const finishDrop = (e, grp) => {
    let ok = (grp !== null ? grp.addMembers(grp.diagram.selection, true) : e.diagram.commandHandler.addTopLevelParts(e.diagram.selection, true));
    if (!ok) e.diagram.currentTool.doCancel();
}

const addNode = (e, obj) => {
    let adornment = obj.part;
    let diagram = e.diagram;
    diagram.startTransaction("Add State");

    // get the node data for which the user clicked the button
    let fromNode = adornment.adornedPart;
    let fromData = fromNode.data;
    // create a new "State" data object, positioned off to the right of the adorned Node
    let newNode = (fromNode.category=="concept" || fromNode.category=="map")?
        {text: "New Relation", loc:"", category:"relation", error: ""}:
        {text: "New Concept", loc:"", category:"concept", error: ""};
    let p = fromNode.location.copy();
    p.x += 120;
    newNode.loc = go.Point.stringify(p);  // the "loc" property is a string, not a Point object
    
    // add the new node data to the model
    let model = diagram.model;
    model.addNodeData(newNode);

    // create a link data from the old node data to the new node data
    let nodeData = {
        from: model.getKeyForNodeData(fromData),  // or just: fromData.id
        to: model.getKeyForNodeData(newNode),
        category: "normal",
        error: ''
    };
    
    // and add the link data to the model
    model.addLinkData(nodeData);

    // select the new Node
    let newrelation = diagram.findNodeForData(newNode);
    diagram.select(newrelation);

    diagram.commitTransaction("Add State");

    // if the new node is off-screen, scroll the diagram to show the new node
    diagram.scrollToRect(newrelation.actualBounds);
}

const nodeInfo = d => {  // Tooltip info for a node data object
    let str;
    if(d.category == "relation") str = "Relation " + d.text + "\n";
    else if(d.category == "concept") str = "Concept " + d.text + "\n";
    if(d.group) str += "Member of " + d.group;
    else str += "Top-level";
    
    str += "\nMore Informations: " + (d.moreInfo?d.moreInfo:"");

    return str;
}

const linkInfo = d => {  // Tooltip info for a link data object
    return "Link:\nfrom " + d.from + " to " + d.to +  + "\nMore Informations: " + (d.data.moreInfo?d.data.moreInfo:"");
}

const groupInfo = adornment => {  // takes the tooltip or context menu, not a group node data object
    let g = adornment.adornedPart;  // get the Group that the tooltip adorns
    let mems = g.memberParts.count;
    let links = 0;
    g.memberParts.each(function(part) {
        if (part instanceof go.Link) links++;
    });
    let relations = 0;
    g.memberParts.each(function(part) {
        if (part instanceof go.Node && part.category == "relation") relations++;
    });
    return "Group " + g.data.key + ": " + g.data.text + "\n" + mems + " members including: \nLinks: " + links + "\nRelations: " + relations + "\nConcepts: " + (mems-links-relations) + "\nMore Informations: " + (g.data.moreInfo?g.data.moreInfo:"");
}

const diagramInfo = model => {  // Tooltip info for the diagram's model
    return "Model:\n" + model.nodeDataArray.length + " nodes and " + model.linkDataArray.length + " links";
}

const highlightGroup = (e, grp, show) => {
    if (!grp) return;
    e.handled = true;
    if (show) {
        // cannot depend on the grp.diagram.selection in the case of external drag-and-drops;
        // instead depend on the DraggingTool.draggedParts or .copiedParts
        let tool = grp.diagram.toolManager.draggingTool;
        let map = tool.draggedParts || tool.copiedParts;  // this is a Map
        // now we can check to see if the Group will accept membership of the dragged Parts
        if (grp.canAddMembers(map.toKeySet())) {
            grp.isHighlighted = true;
            return;
        }
    }
    grp.isHighlighted = false;
}

const validateLink = (fromnode, fromport, tonode, toport) => {
    if(fromnode.data.category == "relation"){
        if(tonode.data.category=="concept" || tonode.data.category=="map") return true;
        else return false;
    }else return tonode.data.category == "relation";  
}

const nodeClicked = (e, obj) => {
    let checkboxes = document.getElementsByName('knownConcepts');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    let node = obj.part;
    if(node.data.metaConcepts) node.data.metaConcepts.forEach(concept => {
        let checkbox = document.getElementById(concept);
        checkbox.checked = true;
    });
}

const partContextMenu =
    $(go.Adornment, "Vertical",
        makeButton("Properties",
            function(e, obj) {  // OBJ is this Button
                let contextmenu = obj.part;  // the Button is in the context menu Adornment
                let part = contextmenu.adornedPart;  // the adornedPart is the Part that the context menu adorns
                if (part instanceof go.Link) {
                    alert({
                            title: 'Link Informations',
                            text: linkInfo(part.data),
                            type: 'info',
                            showCancelButton: false,
                            confirmButtonText: 'Ok',
                            confirmButtonClass: "btn btn-success",
                            buttonsStyling: false
                        });
                }else if (part instanceof go.Group) {
                    alert({
                        title: 'Group Informations',
                        text: groupInfo(contextmenu),
                        type: 'info',
                        showCancelButton: false,
                        confirmButtonText: 'Ok',
                        confirmButtonClass: "btn btn-success",
                        buttonsStyling: false
                    });
                }else {
                    alert({
                        title: 'Node/Relation Informations',
                        text: nodeInfo(part.data),
                        type: 'info',
                        showCancelButton: false,
                        confirmButtonText: 'Ok',
                        confirmButtonClass: "btn btn-success",
                        buttonsStyling: false
                    });
                }
            }, 
        undefined ),
        makeButton("Cut",
            function(e, obj) { e.diagram.commandHandler.cutSelection(); },
            function(o) { return o.diagram.commandHandler.canCutSelection(); }),
        makeButton("Copy",
            function(e, obj) { e.diagram.commandHandler.copySelection(); },
            function(o) { return o.diagram.commandHandler.canCopySelection(); }),
        makeButton("Paste",
            function(e, obj) { e.diagram.commandHandler.pasteSelection(e.diagram.lastInput.documentPoint); },
            function(o) { return o.diagram.commandHandler.canPasteSelection(); }),
        makeButton("Delete",
            function(e, obj) { e.diagram.commandHandler.deleteSelection(); },
            function(o) { return o.diagram.commandHandler.canDeleteSelection(); }),
        makeButton("Undo",
            function(e, obj) { e.diagram.commandHandler.undo(); },
            function(o) { return o.diagram.commandHandler.canUndo(); }),
        makeButton("Redo",
            function(e, obj) { e.diagram.commandHandler.redo(); },
            function(o) { return o.diagram.commandHandler.canRedo(); }),
        makeButton("Group",
            function(e, obj) { e.diagram.commandHandler.groupSelection(); },
            function(o) { return o.diagram.commandHandler.canGroupSelection(); }),
        makeButton("Ungroup",
            function(e, obj) { e.diagram.commandHandler.ungroupSelection(); },
            function(o) { return o.diagram.commandHandler.canUngroupSelection(); })
    );

let diagram = 
    $(go.Diagram,"myDiagramDiv",{
        allowDrop:true,
        mouseDrop: function(e) { finishDrop(e, null); },
        initialContentAlignment: go.Spot.Center,
        "undoManager.isEnabled": true,
        "clickCreatingTool.archetypeNodeData": { text: "New Concept", category: "concept" }, // allow double-click in background to create a new node
        "linkingTool.archetypeLinkData": {category: "normal"},
        "commandHandler.archetypeGroupData": { text: "New Map", isGroup: true, category: "map" },//ctrl+G to group
    });

diagram.toolTip =
    $(go.Adornment, "Auto",
        $(go.Shape, { 
            fill: "#FFFFCC" 
        }),
        $(go.TextBlock, { 
            margin: 4 
        },new go.Binding("text", "", diagramInfo))
    );

diagram.contextMenu =
    $(go.Adornment, "Vertical",
        makeButton("Paste",
            function(e, obj) { e.diagram.commandHandler.pasteSelection(e.diagram.lastInput.documentPoint); },
            function(o) { return o.diagram.commandHandler.canPasteSelection(); }),
        makeButton("Undo",
            function(e, obj) { e.diagram.commandHandler.undo(); },
            function(o) { return o.diagram.commandHandler.canUndo(); }),
        makeButton("Redo",
            function(e, obj) { e.diagram.commandHandler.redo(); },
            function(o) { return o.diagram.commandHandler.canRedo(); }),
        makeButton("Load Meta-Model",
            function(e, obj) {
                let metaModels = JSON.parse(localStorage.getItem('metaModels'));
                let knownConcepts = new Array();
                metaModels.forEach(element => {
                    let model = JSON.parse(element.model);
                    knownConcepts = model.nodeDataArray.filter(el => {
                        el.metaModel = element.name;
                        return el.category == "concept"
                    }).concat(knownConcepts);
                });

                let select = document.getElementById('selectMetaModelConcept');

                knownConcepts.forEach(concept => {
                    console.log(concept);
                    let checkbox = document.createElement("input");
                    checkbox.type = "checkbox";
                    checkbox.id = concept.metaModel + "::" + concept.text;
                    checkbox.name = 'knownConcepts';
                    checkbox.value = concept.metaModel + "::" + concept.text;//e.target.value
                    checkbox.onchange = (e) => {
                        diagram.model.commit(m => {
                            
                            let concept = diagram.selection.first();
                            let metaConcepts = concept.data.metaConcepts || new Array();
                            if(e.target.checked && !metaConcepts.includes(e.target.value)) metaConcepts.push(e.target.value);
                            else if (!e.target.checked && metaConcepts.includes(e.target.value)) metaConcepts = metaConcepts.filter(mc => mc != e.target.value);
                            
                            diagram.clearSelection();
                            diagram.select(concept);

                            m.set(concept.data, "metaConcepts", metaConcepts);
                        }, "change metaConcepts");
                        
                    }

                    select.appendChild(checkbox);

                    let label = document.createElement('label')
                    label.htmlFor = checkbox.id;
                    label.appendChild(document.createTextNode(checkbox.id));

                    select.appendChild(label);
                    select.appendChild(document.createElement("br"));   
                });


            }, undefined),
        makeButton("Save as Meta-Model",
            function(e, obj) {
                let name = prompt('Nome do modelo: ');
                let metamodels = localStorage.getItem('metaModels') !== null ? JSON.parse(localStorage.getItem('metaModels')) : new Array();
                metamodels.push({name, model: e.diagram.model.toJson()});
                localStorage.setItem('metaModels', JSON.stringify(metamodels));
            }, undefined),
    );

conceptNodeTemplate = 
    $(go.Node, "Auto", {
            click: nodeClicked
        }, // the Shape will go around the TextBlock
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Shape, "RoundedRectangle", {
            portId: "", 
            strokeWidth: 1,
            fromLinkable: true, 
            fromLinkableSelfNode: true, 
            fromLinkableDuplicates: true,
            toLinkable: true, 
            toLinkableSelfNode: true, 
            toLinkableDuplicates: true,
            cursor: "pointer",
            fill: $(go.Brush, "Linear", {0: "rgb(254, 201, 0)", 1:"rgb(254, 162, 0)"}),
            stroke: "black"
        },
            // Shape.fill is bound to Node.data.color
            new go.Binding("fill", "color").makeTwoWay(),
            new go.Binding("stroke", "stroke").makeTwoWay(),
            new go.Binding("stroke", "", function(data){ return data.error ? "red":data.stroke ? data.stroke : "black"; }),
            new go.Binding("strokeWidth", "error", function(t) { return t ? 3 : 1; })
        ),
    $(go.TextBlock,{
            font: "bold 12px sans-serif",
            stroke: '#333',
            margin: 6,  // make some extra space for the shape around the text
            isMultiline: true,  // don't allow newlines in text
            editable: true  // allow in-place editing by user
        },  // some room around the text
        // TextBlock.text is bound to Node.data.key
        new go.Binding("text", "text").makeTwoWay(),
        new go.Binding("stroke", "textColor").makeTwoWay()
    ),{ // this tooltip Adornment is shared by all nodes
        toolTip:
        $(go.Adornment, "Auto",
            $(go.Shape, { fill: "#FFFFCC" }),
                $(go.TextBlock, { margin: 4 },  // the tooltip shows the result of calling nodeInfo(data)
                    new go.Binding("text", "", nodeInfo)
                )
        ),
        // this context menu Adornment is shared by all nodes
        contextMenu: partContextMenu
    });

relationNodeTemplate = 
    $(go.Node, "Auto",  // the Shape will go around the TextBlock
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Shape, "Rectangle", {
            portId: "", 
            
            fromLinkable: true, 
            fromLinkableSelfNode: true, 
            fromLinkableDuplicates: true,
            toLinkable: true, 
            toLinkableSelfNode: true, 
            toLinkableDuplicates: true,
            cursor: "pointer",
            fill: "rgba(255,255,255,0)",
            stroke: "rgba(255,255,255,0)",
            strokeWidth: 1
        }),
        $(go.TextBlock,{
            font: "bold 12px sans-serif",
            stroke: '#333',
            margin: 6,  // make some extra space for the shape around the text
            isMultiline: true,  // don't allow newlines in text
            editable: true
        },  // some room around the text
                // TextBlock.text is bound to Node.data.key
            new go.Binding("text", "text").makeTwoWay(),
            new go.Binding("stroke", "textColor").makeTwoWay(),
            new go.Binding("stroke", "", function(data){ return data.error ? "red":data.textColor ? data.textColor : "#333"; }),
            new go.Binding("font", "error", function(t) { return t ? "bold 14px sans-serif" : "bold 12px sans-serif"; })
        ),
        { // this tooltip Adornment is shared by all nodes
            toolTip:
                $(go.Adornment, "Auto",
                    $(go.Shape, { fill: "#FFFFCC" }),
                    $(go.TextBlock, { margin: 4 },  // the tooltip shows the result of calling nodeInfo(data)
                        new go.Binding("text", "", nodeInfo))
                ),
                // this context menu Adornment is shared by all nodes
                contextMenu: partContextMenu
        }
    );

normalLinkTemplate = 
    $(go.Link,{ 
        toShortLength: 3, 
        relinkableFrom: true, 
        relinkableTo: true,
        curve: go.Link.Bezier,
        reshapable: true
    },  // allow the user to relink existing links
        new go.Binding("points").makeTwoWay(),
        $(go.Shape,{
            strokeWidth: 1 
        },
            new go.Binding("stroke", "color").makeTwoWay()
        ),
        $(go.Shape,{ 
            toArrow: "Standard",
            stroke: null
        },
            new go.Binding("stroke", "color").makeTwoWay(),
            new go.Binding("fill", "color").makeTwoWay()
        ),{ // this tooltip Adornment is shared by all links
            toolTip:
                $(go.Adornment, "Auto",
                    $(go.Shape, { fill: "#FFFFCC" }),
                    $(go.TextBlock, { 
                            margin: 4 
                        },  // the tooltip shows the result of calling linkInfo(data)
                        new go.Binding("text", "", linkInfo))
                ),
            // the same context menu Adornment is shared by all links
            contextMenu: partContextMenu
        }
    );

orLinkTemplate = 
    $(go.Link,{ 
        toShortLength: 3, 
        relinkableFrom: true, 
        relinkableTo: true,
        curve: go.Link.Bezier,
        reshapable: true
    },  // allow the user to relink existing links
        new go.Binding("points").makeTwoWay(),
        $(go.Shape,{
                    strokeWidth: 1 
        },
        new go.Binding("stroke", "color").makeTwoWay()),
        $(go.Shape,{
            toArrow: "Standard",
            stroke: null
        },
        new go.Binding("fill", "color").makeTwoWay()),
        $(go.Shape,{
            strokeWidth: 1, 
            fromArrow: "BackwardSemiCircle" 
        },
        new go.Binding("fill", "color").makeTwoWay()),
        { // this tooltip Adornment is shared by all links
            toolTip:
            $(go.Adornment, "Auto",
                $(go.Shape, { fill: "#FFFFCC" }),
                $(go.TextBlock, { 
                        margin: 4 
                    },  // the tooltip shows the result of calling linkInfo(data)
                    new go.Binding("text", "", linkInfo)
                )
            ),
                // the same context menu Adornment is shared by all links
                contextMenu: partContextMenu
        }
    );

mapTemplate =
    $(go.Group, "Auto",{
        // highlight when dragging into the Group
        mouseDragEnter: function(e, grp, prev) { highlightGroup(e, grp, true); },
        mouseDragLeave: function(e, grp, next) { highlightGroup(e, grp, false); },
        computesBoundsAfterDrag: true,
        // when the selection is dropped into a Group, add the selected Parts into that Group;
        // if it fails, cancel the tool, rolling back any changes
        mouseDrop: finishDrop,
        handlesDragDropForMembers: true
    },
    new go.Binding("isSubGraphExpanded", "expanded").makeTwoWay(),
    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
    $(go.Shape, "RoundedRectangle",{
        strokeWidth: 1,
        portId: "", 
        cursor: "pointer",
        fromLinkable: true, 
        fromLinkableSelfNode: true, 
        fromLinkableDuplicates: true,
        toLinkable: true, 
        toLinkableSelfNode: true, 
        toLinkableDuplicates: true,
        fill:  $(go.Brush, "Linear", { 0: "rgba(224,234,252,0.5)", 1: "rgba(207,222,243,0.5)"})
    },
                //new go.Binding("fill", "isHighlighted", function(h) { return h ? "rgba(255,0,0,0.2)" : $(go.Brush, "Linear", { 0: "rgba(224,234,252,0.5)", 1: "rgba(207,222,243,0.5)" }); }).ofObject(),
    new go.Binding('fill', 'color').makeTwoWay(),
    new go.Binding("stroke", "", function(data){ return data.error ? "red": data.stroke ? data.stroke: "black"; }),
    new go.Binding("strokeWidth", "error", function(t) { return t ? 3 : 1; })
    ),
    $(go.Panel, "Vertical",{ 
        defaultAlignment: go.Spot.Center, 
        margin: 6 
    },
    $(go.Panel, "Horizontal",{ 
        defaultAlignment: go.Spot.Top
    },
    $("SubGraphExpanderButton"), // the SubGraphExpanderButton is a panel that functions as a button to expand or collapse the subGraph
    $(go.TextBlock,{
        font: "bold 12px sans-serif",
        stroke: '#333',
        margin: 4,  // make some extra space for the shape around the text
        isMultiline: true,  // don't allow newlines in text
        editable: true, 
        alignment: go.Spot.Center
    },
    new go.Binding("text", "text").makeTwoWay(),
    new go.Binding("stroke", "textColor").makeTwoWay(),
    )),
        $(go.Placeholder, // create a placeholder to represent the area where the contents of the group are
            { 
                padding: new go.Margin(0, 5) 
            }
        )),  // end Vertical Panel
        { // this tooltip Adornment is shared by all nodes
            toolTip:
                $(go.Adornment, "Auto",
                $(go.Shape, { fill: "#FFFFCC" }),
                $(go.TextBlock, { margin: 4 },  // the tooltip shows the result of calling nodeInfo(data)
                    new go.Binding("text", "", groupInfo).ofObject())
                ),
                // this context menu Adornment is shared by all nodes
                contextMenu: partContextMenu
        }
    );  // end Group

selectionAdornmentTemplate =
    $(go.Adornment, "Spot",
        $(go.Panel, "Auto",
            $(go.Shape,{ 
                fill: null, 
                stroke: "blue", 
                strokeWidth: 2 
            }),$(go.Placeholder)  // a Placeholder sizes itself to the selected Node
        ),
            
            // the button to create a "next" node, at the top-right corner
        $("Button",{
            alignment: go.Spot.TopRight,
            click: addNode  // this function is defined below
        },$(go.Shape, { 
            geometryString: "M0 0 L3 0 3 -10 6 -10 x F1 M6 -6 L14 -6 14 -14 6 -14z", 
            fill: "gray" 
        })),
        $("Button",{
            alignment: go.Spot.BottomRight,
            //click: addNode,  // this function is defined below
            visible: false
        },new go.Binding("visible", "", (h, shape) => {
            if(!h.metaConcepts) return false;
            return (h && h.metaConcepts && h.metaConcepts.length > 0);
        }),$(go.Shape, { 
            geometryString: "M0 0 L3 0 3 10 6 10 x F1 M6 6 L14 6 14 14 6 14z", 
            fill: "gray" 
        })),
    ); // end Adornment

diagram.model.set(diagram.model.modelData, "nodechoices", ["Epsilon"]);
conceptNodeTemplate.selectionAdornmentTemplate = selectionAdornmentTemplate;
relationNodeTemplate.selectionAdornmentTemplate = selectionAdornmentTemplate;
mapTemplate.selectionAdornmentTemplate = selectionAdornmentTemplate;

diagram.nodeTemplateMap.add("concept", conceptNodeTemplate);
diagram.nodeTemplateMap.add("relation", relationNodeTemplate);

diagram.linkTemplateMap.add("normal", normalLinkTemplate);
diagram.linkTemplateMap.add("or", orLinkTemplate);

diagram.groupTemplateMap.add("map", mapTemplate);

diagram.toolManager.linkingTool.linkValidation = validateLink;
diagram.toolManager.relinkingTool.linkValidation = validateLink;