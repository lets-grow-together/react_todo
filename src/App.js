import React, { Component } from 'react';

import PageTemplate from './components/PageTemplate';
import Header from './components/Header';
import TodoList from './components/TodoList';
import Footer from './components/Footer';

class App extends Component {
  state = {
    input: 'test',
    todos: [
      { id: 0, text: '리액트 공부하기', isDone: true },
      { id: 1, text: 'ES6 기초', isDone: false },
      { id: 2, text: '컴포넌트 스타일링 하기', isDone: false },
    ]
  };

  render() {
    const { input, todos } = this.state;

    return (
      <div className="App">
        <PageTemplate>
          <Header value={input} />
          <TodoList todos={todos} />
          <Footer />
        </PageTemplate>
      </div>
    );
  }
}

export default App;
