const initialState = {
    flows_designing: {
        activity: 0
    },
    associated_flows: {
        activity: 0
    },
    dashboard: {
        activity: 0
    },
    associate: {
        name: null,
        id: null,
        role: null
    },
    drawer: {
        nodes: [
            {
                id: "Start",
                height: 50,
                width: 100,
                offsetX: 300,
                offsetY: 30,
                shape: { type: "Flow", shape: "Terminator" },
                annotations: [
                    {
                        content: "Start"
                    }
                ],
            },
            {
                id: "End",
                height: 50,
                width: 100,
                offsetX: 300,
                offsetY: 330,
                shape: { type: "Flow", shape: "Terminator" },
                annotations: [
                    {
                        content: "End"
                    }
                ],
            }
        ],
        connectors:[]
    }
}

const reducer = (state = initialState, action) => {
    if (action.type === 'activity_flows_desiging') {
        return {
            ...state,
            flows_designing: {
                activity: action.value
            }
        }
    } else if (action.type === 'activity_associated_flows') {
        return {
            ...state,
            associated_flows: {
                activity: action.value
            }
        }
    } else if (action.type === 'associate_setup') {
        return {
            ...state,
            associate: {
                name: action.name,
                id: action.id,
                role: action.role
            }
        }
    } else if (action.type === 'activity_dashboard') {
        return {
            ...state,
            dashboard:{
                activity: action.value
            }
        }
    } else if (action.type === 'drawer_diagram') {
        return {
            ...state,
            drawer:{
                nodes: action.nodes,
                connectors: action.connectors
            }
        }
    }
    else if(action.type === 'reset_drawer'){
        return{
            ...state,
            drawer: {
                nodes: [
                    {
                        id: "Start",
                        height: 50,
                        width: 100,
                        offsetX: 300,
                        offsetY: 30,
                        shape: { type: "Flow", shape: "Terminator" },
                        annotations: [
                            {
                                content: "Start"
                            }
                        ],
                    },
                    {
                        id: "End",
                        height: 50,
                        width: 100,
                        offsetX: 300,
                        offsetY: 330,
                        shape: { type: "Flow", shape: "Terminator" },
                        annotations: [
                            {
                                content: "End"
                            }
                        ],
                    }
                ],
                connectors:[]
            }
        }
    }
    return state;
}

export default reducer;