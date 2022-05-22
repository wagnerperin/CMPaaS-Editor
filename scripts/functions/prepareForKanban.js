const prepareForKanban = (model) => {
    model.nodeDataArray.forEach(node => {
        node.visible = false;
        if(node.metaConcepts){
            if(node.metaConcepts.includes("KanBan Perspective::-1")){
                
            }else if(node.metaConcepts.includes("KanBan Perspective::-3")){
                node.kanbanCategory = "Release";
                
            }else if(node.metaConcepts.includes("KanBan Perspective::-4")){
                node.kanbanCategory = "Team";
                
            }else if(node.metaConcepts.includes("KanBan Perspective::-5")){
                node.kanbanCategory = "Developing Stage";
                node.visible = true;
                node.isGroup = true;
            }else if(node.metaConcepts.includes("KanBan Perspective::-6")){
                node.visible = true;
                let links = model.linkDataArray.filter(l => l.from == node.key).map(el => el.to);
                let stage = model.linkDataArray.filter(l => links.includes(l.from)).map(el => el.to);
                stage = model.nodeDataArray.filter(n => (stage.includes(n.key) && n.metaConcepts.includes('KanBan Perspective::-5'))).map(el => el.key);
                node.group = stage[0];
            }
        }
        

    });
    return model;
}

export default prepareForKanban;