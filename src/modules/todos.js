import produce from 'immer';
import { createAction, handleActions } from 'redux-actions';
import axios from 'axios';

import * as api from '../lib/api';

const INIT_TODOS_PENDING = 'INIT_TODOS_PENDING';
const INIT_TODOS_SUCCESS = 'INIT_TODOS_SUCCESS';
const INIT_TODOS_FAILURE = 'INIT_TODOS_FAILURE';
const INSERT_TODOS_PENDING = 'INSERT_TODOS_PENDING';
const INSERT_TODOS_SUCCESS = 'INSERT_TODOS_SUCCESS';
const INSERT_TODOS_FAILURE = 'INSERT_TODOS_FAILURE';
const REMOVE_TODOS_PENDING = 'REMOVE_TODOS_PENDING';
const REMOVE_TODOS_SUCCESS = 'REMOVE_TODOS_SUCCESS';
const REMOVE_TODOS_FAILURE = 'REMOVE_TODOS_FAILURE';
const TOGGLE_TODO_PENDING = 'TOGGLE_TODO_PENDING';
const TOGGLE_TODO_SUCCESS = 'TOGGLE_TODO_SUCCESS';
const TOGGLE_TODO_FAILURE = 'TOGGLE_TODO_FAILURE';
const TOGGLE_ALL_PENDING = 'TOGGLE_ALL_PENDING';
const TOGGLE_ALL_SUCCESS = 'TOGGLE_ALL_SUCCESS';
const TOGGLE_ALL_FAILURE = 'TOGGLE_ALL_FAILURE';
const EDIT_START = 'EDIT_START';
const EDIT_CANCEL = 'EDIT_CANCEL';
const EDIT_SAVE_PENDING = 'EDIT_SAVE_PENDING';
const EDIT_SAVE_SUCCESS = 'EDIT_SAVE_SUCCESS';
const EDIT_SAVE_FAILURE = 'EDIT_SAVE_FAILURE';
const CLEAR_COMPLETED_PENDING = 'CLEAR_COMPLETED_PENDING';
const CLEAR_COMPLETED_SUCCESS = 'CLEAR_COMPLETED_SUCCESS';
const CLEAR_COMPLETED_FAILURE = 'CLEAR_COMPLETED_FAILURE';

const initTodoPending = createAction(INIT_TODOS_PENDING);
const initTodoSuccess = createAction(INIT_TODOS_SUCCESS, todos => todos);
const initTodoFailure = createAction(INIT_TODOS_FAILURE, err => err);
export const initTodos = () => dispatch => {
  dispatch(initTodoPending());
  console.log('initTodos start');

  return api.getTodos().then(res => {
    const { data } = res;
    const initialTodos = Object.keys(data).reduce((acc, key) => {
      acc.push({ id: key, text: data[key].text, isDone: data[key].isDone});
      return acc;
    }, []);

    dispatch(initTodoSuccess(initialTodos));
    console.log('initTodos complete');
  })
  .catch(err => {
    dispatch(initTodoFailure(err));
    console.log('initTodo fail');
    throw err;
  });
};

const insertTodoPending = createAction(INSERT_TODOS_PENDING, todo => todo);
const insertTodoSuccess = createAction(INSERT_TODOS_SUCCESS, id => id);
const insertTodoFailure = createAction(INSERT_TODOS_FAILURE, err => err);
export const insertTodo = () => (dispatch, getState) => {
  const { inputData: input } = getState();
  const tempId = 'temp_' + Date.now();
  const tempTodo = { id: tempId, text: input, isDone: false };

  dispatch(insertTodoPending(tempTodo));
  console.log('insertTodo start');

  return api.insertTodo(input)
    .then(res => {
      dispatch(insertTodoSuccess(res.data.name));
      console.log('insertTodo success');
    })
    .catch(err => {
      dispatch(insertTodoFailure(err));
      console.log('insertTodo fail');
    });
};

const removeTodoPending = createAction(REMOVE_TODOS_PENDING, idx => idx);
const removeTodoSuccess = createAction(REMOVE_TODOS_SUCCESS);
const removeTodoFailure = createAction(REMOVE_TODOS_FAILURE, ({ todos, err }) => ({ todos, err }));
export const removeTodo = id => (dispatch, getState) => {
  const { todosData: { todos } } = getState();
  const idx = todos.findIndex(todo => todo.id === id);

  dispatch(removeTodoPending(idx));
  console.log('removeTodo start');

  return api.deleteTodo(id)
    .then(res => {
      dispatch(removeTodoSuccess());
      console.log('removeTodo complete');
    })
    .catch(err => {
      dispatch(removeTodoFailure({ todos, err}));
      console.log('removeTodo fail');
    });
};

const toggleTodoPending = createAction(TOGGLE_TODO_PENDING, idx => idx);
const toggleTodoSuccess = createAction(TOGGLE_TODO_SUCCESS);
const toggleTodoFailure = createAction(TOGGLE_TODO_FAILURE, ({ idx, err }) => ({ idx, err }));
export const toggleTodo = id => (dispatch, getState) => {
  const { todosData: { todos } } = getState();
  const idx = todos.findIndex(todo => todo.id === id);
  const nextIsDone = !todos[idx].isDone;

  dispatch(toggleTodoPending(idx));
  console.log('toggleTodo Start');

  return api.patchTodo(id, { isDone: nextIsDone })
    .then(res => {
      dispatch(toggleTodoSuccess());
      console.log('toggleTodo complete');
    })
    .catch(err => {
      dispatch(toggleTodoFailure({ idx, err }));
      console.log('toggleTodo failure');
    });
};

const toggleAllPending = createAction(TOGGLE_ALL_PENDING, nextIsDone => nextIsDone);
const toggleAllSuccess = createAction(TOGGLE_ALL_SUCCESS);
const toggleAllFailure = createAction(TOGGLE_ALL_FAILURE, ({ todos, err }) => ({ todos, err }));
export const toggleAll = () => (dispatch, getState) => {
  const { todosData: { todos } } = getState();
  const nextIsDone = todos.some(todo=> !todo.isDone);

  dispatch(toggleAllPending(nextIsDone));
  console.log('toggleAll Start');

  const axiArray = todos.map(todo =>
    api.patchTodo(todo.id, { isDone: nextIsDone })
  );

  return axios.all(axiArray)
    .then(res => {
      dispatch(toggleAllSuccess());
      console.log('toggleAll complete');
    })
    .catch(err => {
      dispatch(toggleAllFailure({ todos, err }));
      console.log('toggleAll failure');
    });
};

export const editStart = createAction(EDIT_START, id => id);
export const editCancel = createAction(EDIT_CANCEL);
const editSavePending = createAction(EDIT_SAVE_PENDING, ({ idx, text }) => ({ idx, text }));
const editSaveSuccess = createAction(EDIT_SAVE_SUCCESS);
const editSaveFailure = createAction(EDIT_SAVE_FAILURE, ({ todos, err }) => ({ todos, err }));
export const editSave = (id, text) => (dispatch, getState) => {
  const { todosData: { todos } } = getState();
  const idx = todos.findIndex(todo => todo.id === id);

  dispatch(editSavePending({ idx, text }));
  console.log('editSave start');

  return api.patchTodo(id, { text })
    .then(res => {
      dispatch(editSaveSuccess());
      console.log('editSave success');
    })
    .catch(err => {
      dispatch(editSaveFailure({ todos, err }));
      console.log('editSave failure');
    });
};

const clearCompletedPending = createAction(CLEAR_COMPLETED_PENDING);
const clearCompletedSuccess = createAction(CLEAR_COMPLETED_SUCCESS);
const clearCompletedFailure = createAction(CLEAR_COMPLETED_FAILURE, ({ todos, err }) => ({ todos, err }));
export const clearCompleted = () => (dispatch, getState) => {
  const { todosData: { todos } } = getState();

  dispatch(clearCompletedPending());
  console.log('clearCompleted start');

  const axiArray = todos
    .filter(todo => todo.isDone)
    .map(todo => api.deleteTodo(todo.id));

  return axios.all(axiArray)
    .then(res => {
      dispatch(clearCompletedSuccess());
      console.log('clearCompleted success');
    })
    .catch(err => {
      dispatch(clearCompletedFailure({ todos, err }));
      console.log('clearCompleted failure');
    });
}

const initialState = {
  todos: [],
  editingId: null,
  pending: false,
  error: false
};

export default handleActions({
  [INIT_TODOS_PENDING]: (state, action) => {
    return produce(state, draft => {
      draft.pending = true;
      draft.error = false;
    });
  },
  [INIT_TODOS_SUCCESS]: (state, action) => {
    const { payload: todos } = action;
    return produce(state, draft => {
      draft.todos = todos;
      draft.pending = false;
    });
  },
  [INIT_TODOS_FAILURE]: (state, action) => {
    const { payload: err } = action;
    console.log(err);
    return produce(state, draft => {
      draft.pending = false;
      draft.error = true;
    });
  },
  [INSERT_TODOS_PENDING]: (state, action) => {
    const { payload: tempTodo } = action;
    return produce(state, draft => {
      draft.todos.push(tempTodo);
      draft.pending = true;
      draft.error = false;
    });
  },
  [INSERT_TODOS_SUCCESS]: (state, action) => {
    const { payload: id } = action;
    return produce(state, draft => {
      draft.todos[draft.todos.length - 1].id = id;
      draft.pending = false;
    });
  },
  [INSERT_TODOS_FAILURE]: (state, action) => {
    const { payload: err } = action;
    console.log(err);
    return produce(state, draft => {
      draft.todos.length = draft.todos.length - 1;
      draft.pending = false;
      draft.error = true;
    });
  },
  [REMOVE_TODOS_PENDING]: (state, action) => {
    const { payload: idx } = action;
    return produce(state, draft => {
      draft.todos.splice(idx, 1);
      draft.pending = true;
      draft.error = false;
    });
  },
  [REMOVE_TODOS_SUCCESS]: (state, action) => {
    return produce(state, draft => {
      draft.pending = false;
    });
  },
  [REMOVE_TODOS_FAILURE]: (state, action) => {
    const { todos, err } = action.payload;
    console.log(err);
    return produce(state, draft => {
      draft.todos = todos;
      draft.pending = false;
      draft.error = true;
    });
  },
  [TOGGLE_TODO_PENDING]: (state, action) => {
    const { payload: idx } = action;
    return produce(state, draft => {
      draft.todos[idx].isDone = !draft.todos[idx].isDone;
      draft.pending = true;
      draft.error = false;
    });
  },
  [TOGGLE_TODO_SUCCESS]: (state, action) => {
    return produce(state, draft => {
      draft.pending = false;
    });
  },
  [TOGGLE_TODO_FAILURE]: (state, action) => {
    const { idx, err } = action.payload;
    console.log(err);
    return produce(state, draft => {
      draft.todos[idx].isDone = !draft.todos[idx].isDone;
      draft.pending = false;
      draft.error = true;
    });
  },
  [TOGGLE_ALL_PENDING]: (state, action) => {
    const { payload: nextIsDone } = action;
    return produce(state, draft => {
      draft.todos.forEach(todo => todo.isDone = nextIsDone);
      draft.pending = true;
      draft.error = false;
    });
  },
  [TOGGLE_ALL_SUCCESS]: (state, action) => {
    return produce(state, draft => {
      draft.pending = false;
    });
  },
  [TOGGLE_ALL_FAILURE]: (state, action) => {
    const { todos, err } = action.payload;
    console.log(err);
    return produce(state, draft => {
      draft.todos = todos;
      draft.pending = false;
      draft.error = true;
    });
  },
  [EDIT_START]: (state, action) => {
    const { payload: id } = action;
    return produce(state, draft => {
      draft.editingId = id;
    });
  },
  [EDIT_CANCEL]: (state, action) => {
    return produce(state, draft => {
      draft.editingId = null;
    })
  },
  [EDIT_SAVE_PENDING]: (state, action) => {
    const { idx, text } = action.payload;
    return produce(state, draft => {
      draft.todos[idx].text = text;
      draft.editingId = null;
      draft.pending = true;
      draft.error = false;
    });
  },
  [EDIT_SAVE_SUCCESS]: (state, action) => {
    return produce(state, draft => {
      draft.pending = false;
    });
  },
  [EDIT_SAVE_FAILURE]: (state, action) => {
    const { todos, err } = action.payload;
    console.log(err);
    return produce(state, draft => {
      draft.todos = todos;
      draft.pending = false;
      draft.error = true;
    });
  },
  [CLEAR_COMPLETED_PENDING]: (state, action) => {
    return produce(state, draft => {
      draft.todos = draft.todos.filter(todo => !todo.isDone);
      draft.pending = true;
      draft.error = false;
    });
  },
  [CLEAR_COMPLETED_SUCCESS]: (state, action) => {
    return produce(state, draft => {
      draft.pending = false;
    });
  },
  [CLEAR_COMPLETED_FAILURE]: (state, action) => {
    const { todos, err } = action.payload;
    console.log(err);
    return produce(state, draft => {
      draft.todos = todos;
      draft.pending = false;
      draft.error = true;
    });
  },
}, initialState);
