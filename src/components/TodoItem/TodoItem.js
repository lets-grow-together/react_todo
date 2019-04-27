import React, { Component } from 'react';
import classNames from 'classnames/bind';

import styles from './TodoItem.module.scss';

const cx = classNames.bind(styles);

class TodoItem extends Component {
  render() {
    const { children, isDone, onRemove, onToggle } = this.props;

    return (
      <li className={cx('todo-item')}>
        <div className={cx('todo-item__view')}>
          <input
            type="checkbox"
            className={cx('todo-item__toggle')}
            checked={isDone}
            readOnly
            onClick={onToggle}
          />
          <label className={cx({ 'is-done' : isDone })}>{children}</label>
          <button className={cx('todo-item__del')} onClick={onRemove}>
            <span className="sr-only">삭제</span>
          </button>
        </div>
        <input type="text" className={cx('todo-item__edit')} />
      </li>
    );
  }
}

export default TodoItem;
