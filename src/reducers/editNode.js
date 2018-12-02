const defaultState = {
    showModal : false,
    model:  [],
    params: {},
    list: []
}

const editNode = (state = defaultState, action) => {
    switch (action.type) {
        case 'TOGGLE_MODAL':
            return Object.assign({}, state, {
                showModal: !state.showModal
            });
        case 'SET_MODAL':
            return Object.assign({}, state, {
                type: action.mtype,
                model: action.model,
                params: action.params,
                mode: action.mode,
                id: action.id,
                showModal: true
            });
        case 'SET_LIST':
            return Object.assign({}, state, {
                list: action.list
            });


        default:
            return state
    }
}

export default editNode