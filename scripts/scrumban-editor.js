const $ = go.GraphObject.make;

import {
    PoolLayout,
    linkTemplate,
    nodeTemplate,
    groupTemplate
} from "./scrumban-parts/main.js";

import {
    relayoutDiagram,
    prepareForKanban,
    loadTables
} from "./functions/main.js";


const diagram =
    $(go.Diagram, "myDiagramDiv",
        {
        // make sure the top-left corner of the viewport is occupied
        contentAlignment: go.Spot.TopLeft,
        // use a simple layout to stack the top-level Groups next to each other
        layout: $(PoolLayout),
        // disallow nodes to be dragged to the diagram's background
        mouseDrop: e => {
            e.diagram.currentTool.doCancel();
        },
        // a clipboard copied node is pasted into the original node's group (i.e. lane).
        "commandHandler.copiesGroupKey": true,
        // automatically re-layout the swim lanes after dragging the selection
        "SelectionMoved": relayoutDiagram,  // this DiagramEvent listener is
        "SelectionCopied": relayoutDiagram, // defined above
        "undoManager.isEnabled": true,
        // allow TextEditingTool to start without selecting first
        "textEditingTool.starting": go.TextEditingTool.SingleClick
        });
    // Customize the dragging tool:
    // When dragging a node set its opacity to 0.6 and move it to be in front of other nodes
    diagram.toolManager.draggingTool.doActivate = function() {
        go.DraggingTool.prototype.doActivate.call(this);
        this.currentPart.opacity = 0.6;
        this.currentPart.layerName = "Foreground";
    }
    diagram.toolManager.draggingTool.doDeactivate = function() {
        this.currentPart.opacity = 1;
        this.currentPart.layerName = "";
        go.DraggingTool.prototype.doDeactivate.call(this);
    }
    // There are only three note colors by default, blue, red, and yellow but you could add more here:
    const noteColors = ['#009CCC', '#CC293D', '#FFD700'];
    function getNoteColor(num) {
      return noteColors[Math.min(num, noteColors.length - 1)];
    }

    diagram.linkTemplate = linkTemplate;
    diagram.nodeTemplate = nodeTemplate;
    diagram.groupTemplate = groupTemplate;

let model = JSON.parse(localStorage.getItem('model'));

model = prepareForKanban(model);

window.diagram = diagram; //give global access to diagram.

loadTables(model, diagram);

diagram.model = go.Model.fromJson(model);
