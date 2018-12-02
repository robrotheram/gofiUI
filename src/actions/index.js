let nextTodoId = 0
export const addTodo = text => ({
    type: 'ADD_TODO',
    id: nextTodoId++,
    text
})

export const setVisibilityFilter = filter => ({
    type: 'SET_VISIBILITY_FILTER',
    filter
})

export const toggleTodo = id => ({
    type: 'TOGGLE_TODO',
    id
})
export const toggleModal = () => ({
    type: 'TOGGLE_MODAL'
})

export const setModal = (mtype, model,params, mode, id) => ({
    type: 'SET_MODAL',
    mtype: mtype,
    model: model,
    params: params,
    mode: mode,
    id: id
})

export const paramsList = (list) => ({
    type: 'SET_LIST',
    list
})


export const VisibilityFilters = {
    SHOW_ALL: 'SHOW_ALL',
    SHOW_COMPLETED: 'SHOW_COMPLETED',
    SHOW_ACTIVE: 'SHOW_ACTIVE'
}