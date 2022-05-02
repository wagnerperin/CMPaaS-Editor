const $ = go.GraphObject.make;
import {noteColor} from "../functions/main.js";

const node =
    $(go.Node, "Horizontal",{
            visible: false
        },
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        new go.Binding("visible", "visible"),
        $(go.Shape, "Rectangle", {
        fill: '#009CCC', strokeWidth: 1, stroke: '#009CCC',
        width: 6, stretch: go.GraphObject.Vertical, alignment: go.Spot.Left,
        // if a user clicks the colored portion of a node, cycle through colors
        click: (e, obj) => {
            console.log(obj.part.data);
            diagram.startTransaction("Update node release color");
            let newColor = parseInt(obj.part.data.releaseColor) + 1 || 0;
            console.log(newColor);
            console.log(noteColor.getNoteColorSize());
            if (newColor > noteColor.getNoteColorSize() - 1) newColor = 0;
            diagram.model.setDataProperty(obj.part.data, "releaseColor", newColor);
            diagram.commitTransaction("Update node release color");
        }
        },
        new go.Binding("fill", "releaseColor", noteColor.getNoteColor),
        new go.Binding("stroke", "releaseColor", noteColor.getNoteColor)
        ),
        $(go.Panel, "Auto",
        $(go.Shape, "Rectangle", { fill: "white", stroke: '#CCCCCC' }),
        $(go.Panel, "Table",
            { width: 130, minSize: new go.Size(NaN, 50) },
            $(go.TextBlock,
            {
                name: 'TEXT',
                margin: 6, font: '11px Lato, sans-serif', editable: true,
                stroke: "#000", maxSize: new go.Size(130, NaN),
                alignment: go.Spot.TopLeft
            },
            new go.Binding("text", "text").makeTwoWay())
        )
        ),
        $(go.Shape, "Rectangle", {
        fill: '#009CCC', strokeWidth: 1, stroke: '#009CCC',
        width: 6, stretch: go.GraphObject.Vertical, alignment: go.Spot.Left,
        // if a user clicks the colored portion of a node, cycle through colors
        click: (e, obj) => {
            console.log(obj.part.data);
            diagram.startTransaction("Update node team color");
            let newColor = parseInt(obj.part.data.teamColor) + 1;
            if (newColor > noteColor.getNoteColorSize() - 1) newColor = 0;
            diagram.model.setDataProperty(obj.part.data, "teamColor", newColor);
            diagram.commitTransaction("Update node team color");
        }
        },
        new go.Binding("fill", "teamColor", noteColor.getNoteColor),
        new go.Binding("stroke", "teamColor", noteColor.getNoteColor)
        ),
    );

export default node;