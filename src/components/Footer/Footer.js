import React, { Component } from 'react';
import classNames from 'classnames/bind';

import styles from './Footer.module.scss';

const cx = classNames.bind(styles);

class Footer extends Component {
  render() {
    const {
      selectedFilter,
      activeLength,
      shouldClearCompletedShow,
      onFilterChange,
      onClearCompleted
    } = this.props;

    const filterNames = ['All', 'Active', 'Completed'];
    const filteritems = filterNames.map(filterName => (
      <li
        key={`filter_${filterName}`}
        className={cx({ 'is-selected': filterName === selectedFilter })}
      >
        <a href="#none" onClick={() => onFilterChange(filterName)}>
          {filterName}
        </a>
      </li>
    ));

    return (
      <footer>
        <span className={cx('todo-count')}>
          <strong>{activeLength}</strong> item{activeLength === 1 ? '' : 's'} left
        </span>
        <ul className={cx('todo-filters')}>{filteritems}</ul>
        <button
          className={cx('todo-clear', { 'is-show': shouldClearCompletedShow})}
          onClick={onClearCompleted}
        >
          Clear Completed
        </button>
      </footer>
    );
  }
}

export default Footer;
