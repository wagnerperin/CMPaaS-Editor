const relayoutDiagram = () => {
    let myDiagram = window.diagram;
    myDiagram.selection.each(n => n.invalidateLayout());
    myDiagram.layoutDiagram();
}

export default relayoutDiagram;