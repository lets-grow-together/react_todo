import React, { Component } from 'react';

import * as api from '../lib/api';
import PageTemplate from './PageTemplate';
import Header from './Header';
import TodoList from './TodoList';
import Footer from './Footer';
import axios from 'axios';

class App extends Component {
  state = {
    input: '',
    todos: [
      // { id: 0, text: '리액트 공부하기', isDone: true },
      // { id: 1, text: 'ES6 기초', isDone: false },
      // { id: 2, text: '컴포넌트 스타일링 하기', isDone: false }
    ],
    editingId: null
  };

  componentDidMount() {
    this.getTodos();
  }

  getTodos() {
    console.log('getTodos start');
    api.getTodos().then(res => {
      const { data } = res;
        const initialTodos = Object.keys(data).reduce(
          (acc, key) => {
            acc.push({ id: key, text: data[key].text, isDone: data[key].isDone });
            return acc;
          },
          []
        );
        this.setState({
          todos: initialTodos
        });
        console.log('getTodos complete');
    })
    .catch(err => {
      console.log('getTodos fail');
      throw err;
    });
  }

  handleChange = e => {
    const { value } = e.target;

    this.setState({
      input: value
    });
  };

  handleInsert = () => {
    const { input, todos } = this.state;
    const tempId = 'temp_' + Date.now();
    const newTodo = { id: tempId, text: input, isDone: false };

    this.setState((state, props) => ({
      input: '',
      todos: [...todos, newTodo]
    }));

    console.log('insertTodo start');
    api.insertTodo(input)
      .then(res => {
        this.setState((state, props) => ({
          todos: [...todos, { id: res.data.name, text: input, isDone: false }]
        }));
        console.log('insertTodo complete');
      }).catch(err => {
        console.log('insertTodo fail');
        this.setState((state, props) => ({
          todos: todos
        }));
      });
  };

  handleRemove = id => {
    const { todos } = this.state;
    const idx = todos.findIndex(todo => todo.id === id);
    const nextTodos = [...todos.slice(0, idx), ...todos.slice(idx + 1)];

    this.setState((state, props) => ({
      todos: nextTodos
    }));

    console.log('deletTodo start');
    api.deleteTodo(id)
      .then(res => {
        console.log('deleteTodo complete');
      })
      .catch(err => {
        console.log('deleteTodo fail');
        this.setState((state, props) => ({
          todos
        }));
        throw err;
      })
  };

  handleToggle = id => {
    const { todos } = this.state;
    const idx = todos.findIndex(todo => todo.id === id);
    const nextIsDone = !todos[idx].isDone
    const nextTodos = [
      ...todos.slice(0, idx),
      { ...todos[idx], isDone: nextIsDone },
      ...todos.slice(idx + 1)
    ];

    this.setState((state, props) => ({
      todos: nextTodos
    }));
    
    console.log('toggleTodo start');
    api.patchTodo(id, { isDone: nextIsDone })
      .then(res => {
        console.log('toggleTodo complete');
      })
      .catch(err => {
        this.setState((state, props) => ({
          todos
        }));
        console.log('toggleTodo fail');
        throw err;
      });
  };

  handleToggleAll = () => {
    const { todos } = this.state;
    const nextIsDone = todos.some(todo => !todo.isDone);
    const nextTodos = todos.map(todo => ({ ...todo, isDone: nextIsDone }));
    // const nextTodos = todos.map(todo =>
    //   Object.assign({}, todo, { isDone: nextIsDone })
    // )

    this.setState((state, props) => ({
      todos: nextTodos
    }));

    const axiArray = todos.map(todo =>
      api.patchTodo(todo.id, { isDone: nextIsDone })
    );

    console.log('toggleAll start');
    axios.all(axiArray)
      .then(res => {
        console.log('toggleAll complete');
      })
      .catch(err => {
        console.log('toggleAll faile');
        this.setState((state, props) => ({
          todos
        }));
        throw err;
      });
  };

  handleEditStart = id => {
    this.setState({
      editingId: id
    });
  };

  handleEditSave = (id, text) => {
    const { todos } = this.state;
    const idx = todos.findIndex(todo => todo.id === id);
    const nextTodos = [
      ...todos.slice(0, idx),
      { ...todos[idx], text },
      ...todos.slice(idx + 1)
    ];

    this.setState((state, props) => ({
      todos: nextTodos,
      editingId: null
    }));

    console.log('editSave start');
    api.patchTodo(id, { text })
      .then(res => {
        console.log('editSave complete');
      })
      .catch(err => {
        console.log('editSave fail');
        this.setState((state, props) => ({ todos }));
        throw err;
      });
  };

  handleEditCancel = () => {
    this.setState({
      editingId: null
    });
  };

  handleClearCompleted = () => {
    const { todos } = this.state;
    const nextTodos = todos.filter(todo => !todo.isDone);

    this.setState((state, props) => ({
      todos: nextTodos
    }));

    const axiArray = todos
      .filter(todo => todo.isDone)
      .map(todo => api.deleteTodo(todo.id));

    console.log('clearComplete start');
    axios.all(axiArray)
      .then(res => {
        console.log('clearComplete complete')
      })
      .catch(err => {
        console.log('clearComplete fail');
        this.setState((state, props) => ({ todos }));
        throw err;
      });
  }

  render() {
    const { input, todos, editingId } = this.state;
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
        </PageTemplate>
      </div>
    );
  }
}

export default App;
