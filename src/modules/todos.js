import produce from 'immer';
import { createAction, handleActions } from 'redux-actions';
import axios from 'axios';

import * as api from '../lib/api';

// const INIT_TODOS_PENDING = 'INIT_TODOS_PENDING';
// const INIT_TODOS_SUCCESS = 'INIT_TODOS_SUCCESS';
// const INIT_TODOS_FAILURE = 'INIT_TODOS_FAILURE';
const INIT_TODOS = 'todos/INIT_TODOS';
const INSERT_TODOS = 'todos/INSERT_TODOS';
const REMOVE_TODOS = 'todos/REMOVE_TODOS';
const TOGGLE_TODO = 'todos/TOGGLE_TODO';
const TOGGLE_ALL = 'todos/TOGGLE_ALL';
const EDIT_START = 'todos/EDIT_START';
const EDIT_CANCEL = 'todos/EDIT_CANCEL';
const EDIT_SAVE = 'todos/EDIT_SAVE';
const CLEAR_COMPLETED = 'todos/CLEAR_COMPLETED';

// const initTodoPending = createAction(INIT_TODOS_PENDING);
// const initTodoSuccess = createAction(INIT_TODOS_SUCCESS, todos => todos);
// const initTodoFailure = createAction(INIT_TODOS_FAILURE, err => err);
export const initTodos = () => dispatch => {
  console.log('initTodos start');
  
  // dispatch(initTodoPending());
  // return api.getTodos().then(res => {
  //   const { data } = res;
  //   const initialTodos = Object.keys(data).reduce((acc, key) => {
  //     acc.push({ id: key, text: data[key].text, isDone: data[key].isDone});
  //     return acc;
  //   }, []);

  //   dispatch(initTodoSuccess(initialTodos));
  //   console.log('initTodos complete');
  // })
  // .catch(err => {
  //   dispatch(initTodoFailure(err));
  //   console.log('initTodo fail');
  //   throw err;
  // });

  return dispatch({
    type: INIT_TODOS,
    payload: {
      promise: new Promise((resolve, reject) => {
        api.getTodos()
          .then(({ data }) => {
            const initialTodos = Object.keys(data).reduce((acc, key) => {
              acc.push({ id: key, text: data[key].text, isDone: data[key].isDone });
              return acc;
            }, []);
            resolve(initialTodos);
            console.log('initTodos complete');
          })
          .catch(err => {
            reject(err);
            console.log('initTodos fail');
          })
      })
    }
  }).catch(err => console.error(err));
};

export const insertTodo = () => (dispatch, getState) => {
  const { inputData: input } = getState();
  const tempId = 'temp_' + Date.now();
  const tempTodo = { id: tempId, text: input, isDone: false };

  console.log('insertTodo start');

  return dispatch({
    type: INSERT_TODOS,
    payload: {
      data: tempTodo,
      promise: new Promise((resolve, reject) => {
        api.insertTodo(input)
          .then(({ data }) => {
            resolve(data.name);
            console.log('insertTodo success');
          })
          .catch(err => {
            reject(err);
            console.log('insertTodo fail');
          })
      })
    }
  }).catch(err => console.error(err));
};

export const removeTodo = id => (dispatch, getState) => {
  const { todosData: { todos } } = getState();
  const idx = todos.findIndex(todo => todo.id === id);

  console.log('removeTodo start');

  return dispatch({
    type: REMOVE_TODOS,
    payload: {
      data: idx,
      promise: new Promise((resolve, reject) => {
        api.deleteTodo(id)
          .then(res => {
            resolve();
            console.log('removeTodo complete');
          })
          .catch(err => {
            reject({ todos, err });
            console.log('removeTodo fail');
          });
      })
    }
  }).catch(err => console.error(err));
};

export const toggleTodo = id => (dispatch, getState) => {
  const { todosData: { todos } } = getState();
  const idx = todos.findIndex(todo => todo.id === id);
  const nextIsDone = !todos[idx].isDone;

  console.log('toggleTodo Start');

  return dispatch({
    type: TOGGLE_TODO,
    payload: {
      data: idx,
      promise: new Promise((resolve, reject) => {
        api.patchTodo(id, { isDone: nextIsDone })
          .then(res => {
            resolve();
            console.log('toggleTodo complete');
          })
          .catch(err => {
            reject({ idx, err });
            console.log('toggleTodo failure');
          });
      })
    }
  }).catch(err => console.error(err));
};

export const toggleAll = () => (dispatch, getState) => {
  const { todosData: { todos } } = getState();
  const nextIsDone = todos.some(todo=> !todo.isDone);
  const axiArray = todos.map(todo =>
    api.patchTodo(todo.id, { isDone: nextIsDone })
  );

  console.log('toggleAll Start');

  return dispatch({
    type: TOGGLE_ALL,
    payload: {
      data: nextIsDone,
      promise: new Promise((resolve, reject) => {
        axios.all(axiArray)
          .then(res => {
            resolve();
            console.log('toggleAll complete');
          })
          .catch(err => {
            reject({ todos, err });
            console.log('toggleAll failure');
          });
      })
    }
  }).catch(err => console.error(err));
};

export const editStart = createAction(EDIT_START, id => id);
export const editCancel = createAction(EDIT_CANCEL);

export const editSave = (id, text) => (dispatch, getState) => {
  const { todosData: { todos } } = getState();
  const idx = todos.findIndex(todo => todo.id === id);

  console.log('editSave start');

  return dispatch({
    type: EDIT_SAVE,
    payload: {
      data: { idx, text },
      promise: new Promise((resolve, reject) => {
        api.patchTodo(id, { text })
          .then(res => {
            resolve();
            console.log('editSave success');
          })
          .catch(err => {
            reject({ todos, err });
            console.log('editSave failure');
          });
      })
    }
  }).catch(err => console.error(err));
};

export const clearCompleted = () => (dispatch, getState) => {
  const { todosData: { todos } } = getState();
  const nextTodos = todos.filter(todo => !todo.isDone);
  const axiArray = todos
    .filter(todo => todo.isDone)
    .map(todo => api.deleteTodo(todo.id));

  console.log('clearCompleted start');

  return dispatch({
    type: CLEAR_COMPLETED,
    payload: {
      data: nextTodos,
      promise: new Promise((resolve, reject) => {
        axios.all(axiArray)
          .then(res => {
            resolve();
            console.log('clearCompleted success');
          })
          .catch(err => {
            reject({ todos, err });
            console.log('clearCompleted failure');
          });
      })
    }
  }).catch(err => console.error(err));
}

const initialState = {
  todos: [],
  editingId: null,
  pending: false,
  error: false
};

export default handleActions({
  [`${INIT_TODOS}_PENDING`]: (state, action) => {
    return produce(state, draft => {
      draft.pending = true;
      draft.error = false;
    });
  },
  [`${INIT_TODOS}_SUCCESS`]: (state, action) => {
    const { payload: todos } = action;
    return produce(state, draft => {
      draft.todos = todos;
      draft.pending = false;
    });
  },
  [`${INIT_TODOS}_FAILURE`]: (state, action) => {
    const { payload: err } = action;
    console.log(err);
    return produce(state, draft => {
      draft.pending = false;
      draft.error = true;
    });
  },
  [`${INSERT_TODOS}_PENDING`]: (state, action) => {
    const { payload: tempTodo } = action;
    return produce(state, draft => {
      draft.todos.push(tempTodo);
      draft.pending = true;
      draft.error = false;
    });
  },
  [`${INSERT_TODOS}_SUCCESS`]: (state, action) => {
    const { payload: id } = action;
    return produce(state, draft => {
      draft.todos[draft.todos.length - 1].id = id;
      draft.pending = false;
    });
  },
  [`${INSERT_TODOS}_FAILURE`]: (state, action) => {
    const { payload: err } = action;
    console.log(err);
    return produce(state, draft => {
      draft.todos.length = draft.todos.length - 1;
      draft.pending = false;
      draft.error = true;
    });
  },
  [`${REMOVE_TODOS}_PENDING`]: (state, action) => {
    const { payload: idx } = action;
    return produce(state, draft => {
      draft.todos.splice(idx, 1);
      draft.pending = true;
      draft.error = false;
    });
  },
  [`${REMOVE_TODOS}_SUCCESS`]: (state, action) => {
    return produce(state, draft => {
      draft.pending = false;
    });
  },
  [`${REMOVE_TODOS}_FAILURE`]: (state, action) => {
    const { todos, err } = action.payload;
    console.log(err);
    return produce(state, draft => {
      draft.todos = todos;
      draft.pending = false;
      draft.error = true;
    });
  },
  [`${TOGGLE_TODO}_PENDING`]: (state, action) => {
    const { payload: idx } = action;
    return produce(state, draft => {
      draft.todos[idx].isDone = !draft.todos[idx].isDone;
      draft.pending = true;
      draft.error = false;
    });
  },
  [`${TOGGLE_TODO}_SUCCESS`]: (state, action) => {
    return produce(state, draft => {
      draft.pending = false;
    });
  },
  [`${TOGGLE_TODO}_FAILURE`]: (state, action) => {
    const { idx, err } = action.payload;
    console.log(err);
    return produce(state, draft => {
      draft.todos[idx].isDone = !draft.todos[idx].isDone;
      draft.pending = false;
      draft.error = true;
    });
  },
  [`${TOGGLE_ALL}_PENDING`]: (state, action) => {
    const { payload: nextIsDone } = action;
    return produce(state, draft => {
      draft.todos.forEach(todo => todo.isDone = nextIsDone);
      draft.pending = true;
      draft.error = false;
    });
  },
  [`${TOGGLE_ALL}_SUCCESS`]: (state, action) => {
    return produce(state, draft => {
      draft.pending = false;
    });
  },
  [`${TOGGLE_ALL}_FAILURE`]: (state, action) => {
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
  [`${EDIT_SAVE}_PENDING`]: (state, action) => {
    const { idx, text } = action.payload;
    return produce(state, draft => {
      draft.todos[idx].text = text;
      draft.editingId = null;
      draft.pending = true;
      draft.error = false;
    });
  },
  [`${EDIT_SAVE}_SUCCESS`]: (state, action) => {
    return produce(state, draft => {
      draft.pending = false;
    });
  },
  [`${EDIT_SAVE}_FAILURE`]: (state, action) => {
    const { todos, err } = action.payload;
    console.log(err);
    return produce(state, draft => {
      draft.todos = todos;
      draft.pending = false;
      draft.error = true;
    });
  },
  [`${CLEAR_COMPLETED}_PENDING`]: (state, action) => {
    return produce(state, draft => {
      draft.todos = draft.todos.filter(todo => !todo.isDone);
      draft.pending = true;
      draft.error = false;
    });
  },
  [`${CLEAR_COMPLETED}_SUCCESS`]: (state, action) => {
    return produce(state, draft => {
      draft.pending = false;
    });
  },
  [`${CLEAR_COMPLETED}_FAILURE`]: (state, action) => {
    const { todos, err } = action.payload;
    console.log(err);
    return produce(state, draft => {
      draft.todos = todos;
      draft.pending = false;
      draft.error = true;
    });
  },
}, initialState);
