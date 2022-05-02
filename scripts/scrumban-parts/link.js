const $ = go.GraphObject.make;

const link = 
    $(go.Link,
        $(go.Shape,
            {
                strokeWidth: 0 
            },
        ),
    );

export default link;