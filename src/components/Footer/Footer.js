import React, { Component } from 'react';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

import styles from './Footer.module.scss';

const cx = classNames.bind(styles);

class Footer extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    const isActiveLengthChange = this.props.activeLength !== nextProps.activeLength;
    const isSelectedFilterChange = this.props.selectedFilter !== nextProps.selectedFilter;
    const isClearCompletedShowChange = this.props.shouldClearCompletedShow !== nextProps.shouldClearCompletedShow;

    return isActiveLengthChange || isSelectedFilterChange || isClearCompletedShowChange;
  }

  render() {
    const {
      selectedFilter,
      activeLength,
      shouldClearCompletedShow,
      onClearCompleted
    } = this.props;

    const filterNames = ['', 'active', 'completed'];
    const filteritems = filterNames.map(filterName => (
      <li
        key={`filter_${filterName}`}
        className={cx({ 'is-selected': filterName === selectedFilter })}
      >
        <Link to={`/${filterName}`}>
          {filterName ? filterName.replace(/^\w/, v => v.toUpperCase()) : 'All'}
        </Link>
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
