const validateLinks = (fromnode, _, tonode, __) => {
    if(fromnode.data.category === "relation"){
        if(tonode.data.category=== "concept" || tonode.data.category === "map") return true;
        else return false;
    }else return tonode.data.category === "relation";
}
export default validateLinks;