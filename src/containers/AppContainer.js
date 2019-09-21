import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import App from '../components/App';
import * as inputActions from '../modules/input';
import * as todosActions from '../modules/todos';

export default connect(
  state => ({
    input: state.inputData,
    todos: state.todosData.todos,
    editingId: state.todosData.editingId,
    pending: state.todosData.pending,
    error: state.todosData.error
  }),
  dispatch => ({
    InputActions: bindActionCreators(inputActions, dispatch),
    TodosActions: bindActionCreators(todosActions, dispatch)
  })
)(App);