import { addNode } from "../../functions/main.js";

const $ = go.GraphObject.make;

const relationNodeSelection = 
    $(go.Adornment, "Spot",
        $(go.Panel, "Auto",
            $(go.Shape, {
                fill: null,
                stroke: "blue",
                strokeWidth: 2
            }),
            $(go.Placeholder)
        ),
        $("Button",{
            alignment: go.Spot.TopRight,
            click: addNode  // this function is defined below
        },$(go.Shape, { 
            geometryString: "M0 0 L2 0 3 -10 6 -10 M4 -12 L6 -10 4 -8 x F1 M6 -6 L14 -6 14 -14 6 -14z", 
            stroke: "black",
            fill: $(go.Brush, "Linear", {0: "rgba(254, 201, 0, 0.9)", 1:"rgba(254, 162, 0, 0.7)"})
        })),
    )

export default relationNodeSelection;