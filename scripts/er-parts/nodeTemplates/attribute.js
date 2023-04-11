const $ = go.GraphObject.make;

const attribute = 
            $(go.Node, "Horizontal",{
                    locationSpot: go.Spot.Center,  // Node.location is the center of the Shape
                    locationObjectName: "SHAPE",
                    selectionAdorned: false
                },
                $(go.Panel, "Spot",
                $(go.Shape, "Circle",{
                    name: "SHAPE",
                    fill: "white",  // default value, but also data-bound
                    strokeWidth: 1,
                    stroke: "black",
                    desiredSize: new go.Size(10, 10),
                    portId: ""  // so links will go to the shape, not the whole node
                })),
                $(go.TextBlock,{
                    font: "10px sans-serif",
                    margin: 2, 
                },
                    new go.Binding("text", "text").makeTwoWay())
            );

export default attribute;