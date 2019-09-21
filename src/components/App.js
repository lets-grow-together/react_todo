import React, { Component } from 'react';

import PageTemplate from './PageTemplate';
import Header from './Header';
import TodoList from './TodoList';
import Footer from './Footer';
import Status from './common/Status';

class App extends Component {
  // state = {
  //   input: '',
  //   todos: [
  //     { id: 0, text: '리액트 공부하기', isDone: true },
  //     { id: 1, text: 'ES6 기초', isDone: false },
  //     { id: 2, text: '컴포넌트 스타일링 하기', isDone: false }
  //   ],
  //   editingId: null
  // };

  componentDidMount() {
    //this.getTodos();
    this.props.TodosActions.initTodos();
  }

  // getTodos() {
  //   console.log('getTodos start');
  //   api.getTodos().then(res => {
  //     const { data } = res;
  //       const initialTodos = Object.keys(data).reduce(
  //         (acc, key) => {
  //           acc.push({ id: key, text: data[key].text, isDone: data[key].isDone });
  //           return acc;
  //         },
  //         []
  //       );
  //       this.setState({
  //         todos: initialTodos
  //       });
  //       console.log('getTodos complete');
  //   })
  //   .catch(err => {
  //     console.log('getTodos fail');
  //     throw err;
  //   });
  // }

  handleChange = e => {
    const { value } = e.target;
    this.props.InputActions.changeInput(value);

    // this.setState({
    //   input: value
    // });
  };

  handleInsert = () => {
    this.props.TodosActions.insertTodo();
    this.props.InputActions.clearInput();
  };

  handleRemove = id => {
    this.props.TodosActions.removeTodo(id);
  };

  handleToggle = id => this.props.TodosActions.toggleTodo(id);

  handleToggleAll = () => this.props.TodosActions.toggleAll();

  handleEditStart = id => this.props.TodosActions.editStart(id);

  handleEditSave = (id, text) => this.props.TodosActions.editSave(id, text);

  handleEditCancel = () => this.props.TodosActions.editCancel();

  handleClearCompleted = () => this.props.TodosActions.clearCompleted();

  render() {
    const { input, todos, editingId, pending, error } = this.props;
    const { match: { params } } = this.props;
    const {
      handleChange,
      handleInsert,
      handleRemove,
      handleToggle,
      handleToggleAll,
      handleEditStart,
      handleEditSave,
      handleEditCancel,
      handleFilterChange,
      handleClearCompleted
    } = this;

    const filterName = params && (params.filterName || '');
    const isAllDone = todos.every(todo => todo.isDone);

    let filteredTodos;
    switch (filterName) {
      case 'active':
        filteredTodos = todos.filter(todo => !todo.isDone);
        break;
      case 'completed':
        filteredTodos = todos.filter(todo => todo.isDone);
        break;
      case '':
      default:
        filteredTodos = todos;
    }
    const completedLength = todos.filter(todo => todo.isDone).length;
    const shouldClearCompletedShow = completedLength > 0;
    const activeLength = todos.length - completedLength;

    return (
      <div className="App">
        <PageTemplate>
          <Header
            value={input}
            isAllDone={isAllDone}
            onChange={handleChange}
            onInsert={handleInsert}
            onToggleAll={handleToggleAll}
          />
          <TodoList
            todos={filteredTodos}
            editingId={editingId}
            onRemove={handleRemove}
            onToggle={handleToggle}
            onEditStart={handleEditStart}
            onEditSave={handleEditSave}
            onEditCancel={handleEditCancel}
          />
          <Footer
            selectedFilter={filterName}
            activeLength={activeLength}
            shouldClearCompletedShow={shouldClearCompletedShow}
            onFilterChange={handleFilterChange}
            onClearCompleted={handleClearCompleted}
          />
          <Status pending={pending} error={error} />
        </PageTemplate>
      </div>
    );
  }
}

export default App;
