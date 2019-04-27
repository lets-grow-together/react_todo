import React, { Component } from 'react';

import PageTemplate from './components/PageTemplate';
import Header from './components/Header';
import TodoList from './components/TodoList';
import Footer from './components/Footer';

class App extends Component {
  state = {
    input: '',
    todos: [
      { id: 0, text: '리액트 공부하기', isDone: true },
      { id: 1, text: 'ES6 기초', isDone: false },
      { id: 2, text: '컴포넌트 스타일링 하기', isDone: false },
    ]
  };

  handleChange = e => {
    const { value } = e.target;

    this.setState({
      input: value
    });
  }

  handleInsert = () => {
    const { input, todos } = this.state;
    const tempId = 'temp_' + Date.now();
    const newTodo = { id: tempId, text: input, isDone: false };

    this.setState({
      input: '',
      todos: [...todos, newTodo]
    });
  }

  render() {
    const { input, todos } = this.state;
    const { handleChange, handleInsert } = this;

    return (
      <div className="App">
        <PageTemplate>
          <Header
            value={input}
            onChange={handleChange}
            onInsert={handleInsert}
          />
          <TodoList todos={todos} />
          <Footer />
        </PageTemplate>
      </div>
    );
  }
}

export default App;
