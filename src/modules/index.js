import { combineReducers } from 'redux';

import input from './input';
import todos from './todos';

export default combineReducers({
  inputData: input,
  todosData: todos
});
