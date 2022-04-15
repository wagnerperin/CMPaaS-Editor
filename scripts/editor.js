const $ = go.GraphObject.make;
import {
    model, 
    conceptNodeTemplate, 
    relationNodeTemplate,
    instanceNodeTemplate, 
    submapGroupTemplate,
    instanceRelationTemplate,
    conceptNodeSelectionAdornmentTemplate,
    relationNodeSelectionAdornmentTemplate,
    instanceNodeSelectionAdornmentTemplate,
    instanceRelSelectionAdornmentTemplate
} from "./parts/main.js";
import {validateLinks} from './functions/main.js';

const diagram = 
    $(go.Diagram, 'myDiagramDiv', {
        allowDrop:true,
        //mouseDrop: function(e){console.log(e)}, //MOUSE DROP FUNCTION
        initialContentAlignment: go.Spot.Center,
        "undoManager.isEnabled": true,
        "clickCreatingTool.archetypeNodeData": { text: "New Concept", category: "concept" }, //Double-click create a new concept
        "linkingTool.archetypeLinkData": {category: "normal"}, //normal links
        "commandHandler.archetypeGroupData": { text: "New Map", isGroup: true, category: "map" } //ctrl+g to group
    });

conceptNodeTemplate.selectionAdornmentTemplate = conceptNodeSelectionAdornmentTemplate;
relationNodeTemplate.selectionAdornmentTemplate = relationNodeSelectionAdornmentTemplate;
submapGroupTemplate.selectionAdornmentTemplate = conceptNodeSelectionAdornmentTemplate;
instanceNodeTemplate.selectionAdornmentTemplate = instanceNodeSelectionAdornmentTemplate;
instanceRelationTemplate.selectionAdornmentTemplate = instanceRelSelectionAdornmentTemplate;

diagram.nodeTemplateMap.add('concept',conceptNodeTemplate);
diagram.nodeTemplateMap.add('instance',instanceNodeTemplate);
diagram.nodeTemplateMap.add('instanceRel', instanceRelationTemplate);
diagram.nodeTemplateMap.add('relation',relationNodeTemplate);

diagram.groupTemplateMap.add('map', submapGroupTemplate);

diagram.toolManager.linkingTool.linkValidation = validateLinks;
diagram.toolManager.relinkingTool.linkValidation = validateLinks;


diagram.model = model;
window.diagram = diagram; //give global access to diagram.