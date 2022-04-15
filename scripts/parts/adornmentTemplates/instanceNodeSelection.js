import { addNode, addInstanceRelation } from "../../functions/main.js";
const $ = go.GraphObject.make;

const instanceNodeSelection = 
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
            click: addNode  
        },$(go.Shape, { 
            geometryString: "M0 0 L3 0 8 12 14 12 M12 10 L14 12 12 14", 
            stroke: "black"
        })),
        $("Button",{
            alignment: go.Spot.BottomRight,
            click: addInstanceRelation
        },$(go.Shape, { 
            geometryString: "M0 0 L0 12 14 12 M12 10 L14 12 12 14", 
            stroke: "black"
        })),
    )

export default instanceNodeSelection;