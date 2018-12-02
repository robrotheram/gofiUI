import { combineReducers } from 'redux';
import visibilityFilter from './visibilityFilter'
import todos from './todo'
import editNode from './editNode'

export default combineReducers({
    todos,
    visibilityFilter,
    editNode
})