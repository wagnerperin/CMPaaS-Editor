import { noteColor } from "./main.js";

const generateParts = (model) => {
    let outString = "$(go.Part, \"Table\",{ position: new go.Point(10, 10), selectable: false },$(go.TextBlock, \"Left: Releases\",{ row: 0, font: \"700 14px Droid Serif, sans-serif\", margin: new go.Margin(20, 0, 0, 0) }),";
    let row = 1;
    let color = 0;
    model.nodeDataArray.forEach(node => {
        if(node.kanbanCategory == "Release"){
            outString += "$(go.Panel, \"Horizontal\",{ row: "+row+", alignment: go.Spot.Left },$(go.Shape, \"Rectangle\",{ desiredSize: new go.Size(10, 10), fill: '"+noteColor.getNoteColor(color)+"', margin: 5 }),$(go.TextBlock, \"" +
            node.text + "\",{ font: \"700 13px Droid Serif, sans-serif\" })),";

            row++;
            color++;
        }
    });

    outString += "$(go.TextBlock, \"Right: Team\",{ row:"+ row+", font: \"700 14px Droid Serif, sans-serif\",  margin: new go.Margin(20, 0, 0, 0)  })";
    row++;
    color=0;
    model.nodeDataArray.forEach(node => {
        if(node.kanbanCategory == "Team"){
            outString += ",$(go.Panel, \"Horizontal\",{ row:"+row+", alignment: go.Spot.Left },$(go.Shape, \"Rectangle\",{ desiredSize: new go.Size(10, 10), fill: '"+noteColor.getNoteColor(color)+"', margin: 5 }),$(go.TextBlock, \"" +
            node.text + "\",{ font: \"700 13px Droid Serif, sans-serif\" }))";

            row++;
            color++;
        }
    });

    outString += ")";

    return outString;
}


const loadTables = (model, diagram) => {
    const $ = go.GraphObject.make;
    diagram.add(
        eval(generateParts(model))
    );
}



export default loadTables;