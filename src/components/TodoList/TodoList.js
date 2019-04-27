import React, { Component } from 'react';
import className from 'classnames/bind';

import styles from './TodoList.module.scss';
import TodoItem from '../TodoItem';

const cx = className.bind(styles);

class TodoList extends Component {
  render() {
    const { todos } = this.props;

    const todoItems = todos.map(todo => (
      <TodoItem
        key={todo.id}
        isDone={todo.isDone}
      >
        {todo.text}
      </TodoItem>
    ));

    return (
      <div className={cx('todo__list-wrap')}>
        <ul className={cx('todo__list')}>
          {todoItems}
        </ul>
      </div>
    );
  }
}

export default TodoList;
