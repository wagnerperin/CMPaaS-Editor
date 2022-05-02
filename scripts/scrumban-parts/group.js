import {highlightKanbanGroup} from "../functions/main.js";

const $ = go.GraphObject.make;

const group =
    $(go.Group, "Vertical",
        {
        visible:false,
        selectable: false,
        selectionObjectName: "SHAPE", // even though its not selectable, this is used in the layout
        layerName: "Background",  // all lanes are always behind all nodes and links
        layout: $(go.GridLayout,  // automatically lay out the lane's subgraph
            {
            wrappingColumn: 1,
            cellSize: new go.Size(1, 1),
            spacing: new go.Size(5, 5),
            alignment: go.GridLayout.Position,
            comparer: (a, b) => {  // can re-order tasks within a lane
                const ay = a.location.y;
                const by = b.location.y;
                if (isNaN(ay) || isNaN(by)) return 0;
                if (ay < by) return -1;
                if (ay > by) return 1;
                return 0;
            }
            }),
        click: (e, grp) => {  // allow simple click on group to clear selection
            if (!e.shift && !e.control && !e.meta) e.diagram.clearSelection();
        },
        computesBoundsAfterDrag: true,  // needed to prevent recomputing Group.placeholder bounds too soon
        handlesDragDropForMembers: true,  // don't need to define handlers on member Nodes and Links
        mouseDragEnter: (e, grp, prev) => highlightKanbanGroup(grp, true),
        mouseDragLeave: (e, grp, next) => highlightKanbanGroup(grp, false),
        mouseDrop: (e, grp) => {  // dropping a copy of some Nodes and Links onto this Group adds them to this Group
            // don't allow drag-and-dropping a mix of regular Nodes and Groups
            console.log(grp.data);
            if (e.diagram.selection.all(n => !(n instanceof go.Group))) {
            const ok = grp.addMembers(grp.diagram.selection, true);
            if (!ok) grp.diagram.currentTool.doCancel();
            else{
                //parei aqui

                console.log(diagram.model.linkDataArray);

                console.log(diagram.selection.first().data);
            }
            }
        },
        subGraphExpandedChanged: grp => {
            const shp = grp.selectionObject;
            if (grp.diagram.undoManager.isUndoingRedoing) return;
            if (grp.isSubGraphExpanded) {
            shp.width = grp.data.savedBreadth;
            } else {  // remember the original width
            if (!isNaN(shp.width)) grp.diagram.model.set(grp.data, "savedBreadth", shp.width);
            shp.width = NaN;
            }
        }
        },
        new go.Binding("visible", "visible"),
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        new go.Binding("isSubGraphExpanded", "expanded").makeTwoWay(),
        // the lane header consisting of a TextBlock and an expander button
        $(go.Panel, "Horizontal",
        { name: "HEADER", alignment: go.Spot.Left },
        $("SubGraphExpanderButton", { margin: 5 }),  // this remains always visible
        $(go.TextBlock,  // the lane label
            { font: "15px Lato, sans-serif", editable: true, margin: new go.Margin(2, 0, 0, 0) },
            // this is hidden when the swimlane is collapsed
            new go.Binding("visible", "isSubGraphExpanded").ofObject(),
            new go.Binding("text").makeTwoWay())
        ),  // end Horizontal Panel
        $(go.Panel, "Auto",  // the lane consisting of a background Shape and a Placeholder representing the subgraph
        $(go.Shape, "Rectangle",  // this is the resized object
            { name: "SHAPE", fill: "#F1F1F1", stroke: null, strokeWidth: 4 },  // strokeWidth controls space between lanes
            new go.Binding("fill", "isHighlighted", h => h ? "#D6D6D6" : "#F1F1F1").ofObject(),
            new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify)),
        $(go.Placeholder,
            { padding: 12, alignment: go.Spot.TopLeft }),
        $(go.TextBlock,  // this TextBlock is only seen when the swimlane is collapsed
            {
            name: "LABEL", font: "15px Lato, sans-serif", editable: true,
            angle: 90, alignment: go.Spot.TopLeft, margin: new go.Margin(4, 0, 0, 2)
            },
            new go.Binding("visible", "isSubGraphExpanded", e => !e).ofObject(),
            new go.Binding("text").makeTwoWay())
        )  // end Auto Panel
    );  // end Group

export default group;