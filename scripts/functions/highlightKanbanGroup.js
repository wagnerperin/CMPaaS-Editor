
const highlightKanbanGroup = (grp, show) => {
    if (show) {
        const part = diagram.toolManager.draggingTool.currentPart;
        if (part.containingGroup !== grp) {
        grp.isHighlighted = true;
        return;
        }
    }
    grp.isHighlighted = false;
}

export default highlightKanbanGroup;