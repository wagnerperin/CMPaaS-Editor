const $ = go.GraphObject.make;

const entity = 
    $(go.Node, "Auto",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Shape, "Rectangle", {
            portId: "", 
            fromLinkable: true, 
            fromLinkableSelfNode: false, 
            fromLinkableDuplicates: true,
            toLinkable: true, 
            toLinkableSelfNode: false, 
            toLinkableDuplicates: true,
            cursor: "pointer",
            fill: "white",
            stroke: "black",
            strokeWidth: 1
        },
            new go.Binding("fill", "backgroundColor").makeTwoWay(),
            new go.Binding("stroke", "borderColor").makeTwoWay()
        ),
        $(go.TextBlock, {
            font: "bold 12px sans-serif",
            stroke: "#333",
            margin: 6,  // make some extra space for the shape around the text
            isMultiline: true,
            editable: true  // allow in-place editing by user
        },  // some room around the text
            // TextBlock.text is bound to Node.data.key
            new go.Binding("text", "text").makeTwoWay(),
            new go.Binding("stroke", "textColor").makeTwoWay())
    );

export default entity;