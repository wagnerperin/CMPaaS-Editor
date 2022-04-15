const $ = go.GraphObject.make;

const instanceRelation =
    $(go.Node, "Auto",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Shape, "RoundedRectangle", {
            portId: "", 
            fromLinkable: true, 
            fromLinkableSelfNode: false, 
            fromLinkableDuplicates: true,
            toLinkable: true, 
            toLinkableSelfNode: false, 
            toLinkableDuplicates: true,
            cursor: "pointer",
            fill: "rgba(255,255,255,0)",
            stroke: "rgba(255,255,255,0)",
            strokeWidth: 0
        }),
        $(go.TextBlock,{
            font: "bold 12px sans-serif",
            stroke: '#333',
            margin: 6,  // make some extra space for the shape around the text
            isMultiline: true,  // don't allow newlines in text
            editable: true,
            textEditor: window.TextEditorSelectBox,
            textEdited: function(textBlock, previousText, currentText){
                // console.log(textBlock.choices);
                // console.log(previousText),
                // console.log(currentText);
            }
        },
            new go.Binding("choices", "choices"),
            new go.Binding("text", "text").makeTwoWay(),
            new go.Binding("stroke", "textColor").makeTwoWay()
        )
    );


export default instanceRelation;