const prepareForKanban = (model) => {
    model.nodeDataArray.forEach(node => {
        node.visible = false;
        if(node.metaConcepts){
            if(node.metaConcepts.includes("ScrumBan Viewpoint::-1")){
                
            }else if(node.metaConcepts.includes("ScrumBan Viewpoint::-3")){
                node.kanbanCategory = "Release";
                
            }else if(node.metaConcepts.includes("ScrumBan Viewpoint::-4")){
                node.kanbanCategory = "Team";
                
            }else if(node.metaConcepts.includes("ScrumBan Viewpoint::-6")){
                node.kanbanCategory = "Developing Stage";
                node.visible = true;
                node.isGroup = true;
            }else if(node.metaConcepts.includes("ScrumBan Viewpoint::-5")){
                node.visible = true;
                let links = model.linkDataArray.filter(l => l.from == node.key).map(el => el.to);
                let stage = model.linkDataArray.filter(l => l.from == links[0]).map(el => el.to);
                node.group = stage[0];
            }
        }
        

    });
    return model;
}

export default prepareForKanban;