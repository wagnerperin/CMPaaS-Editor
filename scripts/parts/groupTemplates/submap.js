const $ = go.GraphObject.make;
import {highlightGroup, finishDrop} from '../../functions/main.js';

const submap = 
    $(go.Group, "Auto",{
        mouseDragEnter: (e, grp, _) => { highlightGroup(e, grp, true); },
        mouseDragLeave: (e, grp, _) => { highlightGroup(e, grp, false); },
        computesBoundsAfterDrag: true,
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
    new go.Binding('fill', 'color').makeTwoWay(),
    ),
    $(go.Panel, "Vertical",{ 
        defaultAlignment: go.Spot.Center, 
        margin: 6 
    },
    $(go.Panel, "Horizontal",{ 
        defaultAlignment: go.Spot.Top
    },
    $("SubGraphExpanderButton"), 
    $(go.TextBlock,{
        font: "bold 12px sans-serif",
        stroke: '#333',
        margin: 4,  
        isMultiline: true,  
        editable: true, 
        alignment: go.Spot.Center
    },
    new go.Binding("text", "text").makeTwoWay(),
    new go.Binding("stroke", "textColor").makeTwoWay(),
    )),
    $(go.Placeholder, { 
        padding: new go.Margin(0, 5) 
    })));

export default submap;