const $ = go.GraphObject.make;
import {
    entityNodeTemplate,
    attributeNodeTemplate
} from "./er-parts/main.js";

const diagram = 
    $(go.Diagram, 'myDiagramDiv', {
        allowDrop:true,
        //mouseDrop: function(e){console.log(e)}, //MOUSE DROP FUNCTION
        initialContentAlignment: go.Spot.Center,
        "undoManager.isEnabled": true,
        "clickCreatingTool.archetypeNodeData": { text: "New Entity", category: "entity" }, //Double-click create a new concept
        "linkingTool.archetypeLinkData": {category: "link"} //normal links
    });

diagram.nodeTemplateMap.add('entity',entityNodeTemplate);
diagram.nodeTemplateMap.add('attribute', attributeNodeTemplate);

diagram.linkTemplate = 
    $(go.Link,
    {
      routing: go.Link.Orthogonal,
      selectable: false
    },
    $(go.Shape, { strokeWidth: 1, stroke: 'black' }));


const nodeDataArray = 
    [{
        key: 1, 
        text: "Entity A",
        category: "entity"
    },{
        key: 2, 
        text: "Attribute 1",
        category: "attribute"
    },{
        key: 3, 
        text: "Attribute 2",
        category: "attribute"
    }
];

const linkDataArray = [{from: 1, to: 2}, {from: 1, to: 3}];

const model = new go.GraphLinksModel(nodeDataArray, linkDataArray);

diagram.model = model;

window.diagram = diagram; //give global access to diagram.