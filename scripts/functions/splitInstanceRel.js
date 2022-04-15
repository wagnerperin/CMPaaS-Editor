const splitInstanceRel = (data) => {
    let split = data.text.split("::");
    if(split[2] === undefined) split[2] = data.metaRelations.find(mr => mr.text == split[1]).id;

    return {
        modelName: split[0],
        text: split[1],
        id: split[2]
    };
}

export default splitInstanceRel;