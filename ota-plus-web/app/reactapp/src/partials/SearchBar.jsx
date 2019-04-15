/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Input } from 'formsy-antd';
import { Icon } from 'antd';
import { SEARCH_REFRESH_TIMEOUT } from '../constants';

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.searchTimeout = undefined;
  }

  clearInput = () => {
    this.props.changeAction('');
  };

  onChange = value => {
    const { changeAction } = this.props;
    const filter = value;
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      this.searchTimeout = undefined;
      changeAction(filter);
    }, SEARCH_REFRESH_TIMEOUT);
  };

  render() {
    const { value, disabled, id, additionalClassName } = this.props;
    return (
      <div className={'search-box ' + (additionalClassName ? additionalClassName : '')}>
        <Input
          name='filterValue'
          value={value}
          id={id}
          className='input-wrapper search'
          disabled={disabled}
          onChange={this.onChange}
          prefix={<Icon type='search' />}
          suffix={<Icon type='close' onClick={this.clearInput} />}
        />
      </div>
    );
  }
}

SearchBar.propTypes = {
  value: PropTypes.string,
  changeAction: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

SearchBar.defaultProps = {
  disabled: false,
};

export default SearchBar;
