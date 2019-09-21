import { createAction, handleActions } from 'redux-actions';

const CHANGE_INPUT = 'CHANGE_INPUT';
const CLEAR_INPUT = 'CLEAR_INPUT';

export const changeInput = createAction(CHANGE_INPUT, value => value);
export const clearInput = createAction(CLEAR_INPUT);

const initialState = '';

export default handleActions({
  [CHANGE_INPUT]: (state, action) => action.payload,
  [CLEAR_INPUT]: (state, action) => ''
}, initialState);
