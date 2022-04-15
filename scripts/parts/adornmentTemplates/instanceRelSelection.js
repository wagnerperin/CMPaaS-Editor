import { addInstanceNode } from "../../functions/main.js";
const $ = go.GraphObject.make;

const instanceRelSelection = 
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
            alignment: go.Spot.BottomRight,
            click: addInstanceNode
        },$(go.Shape, { 
            geometryString: "M0 0 L0 12 5 12 M3 10 L5 12 3 14 x F1 M6 6 L14 6 14 14 6 14z", 
            stroke: "black",
            fill: $(go.Brush, "Linear", {0: "rgba(254, 201, 0, 0.9)", 1:"rgba(254, 162, 0, 0.7)"})
        })),
    )

export default instanceRelSelection;