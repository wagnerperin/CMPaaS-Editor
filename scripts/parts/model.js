
const nodeDataArray = 
    [{
        key: 1, 
        text: "Concept A",
        category: 'concept',
        loc: "-67 -7"
    },{
        key: 2, 
        text: "Relation 1",
        category: 'relation',
        loc: "42 -7"
    }, {
        key: 3,
        text: 'Concept B',
        category: 'concept',
        loc: "143 -7"
    }];

const linkDataArray = 
    [{
        from: 1, 
        to: 2
    },{
        from: 2,
        to: 3
    }];

const model = new go.GraphLinksModel(nodeDataArray, linkDataArray);

export default model;