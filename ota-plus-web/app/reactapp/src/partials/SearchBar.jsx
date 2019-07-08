/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Input } from 'formsy-antd';
import { SEARCH_REFRESH_TIMEOUT } from '../constants';

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.searchTimeout = undefined;
  }

  clearInput = () => {
    const { changeAction } = this.props;
    changeAction('');
  };

  onChange = (value) => {
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
    const { value, disabled, id, additionalClassName, placeholder } = this.props;
    return (
      <div className={`search-box ${additionalClassName || ''}`}>
        <Input
          name="filterValue"
          value={value}
          id={id}
          className="input-wrapper search"
          disabled={disabled}
          onChange={this.onChange}
          placeholder={placeholder}
          prefix={<i className="fa fa-search icon-search" />}
          suffix={<i className="fa fa-close icon-close" onClick={this.clearInput} />}
        />
      </div>
    );
  }
}

SearchBar.propTypes = {
  value: PropTypes.string,
  changeAction: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  additionalClassName: PropTypes.string,
  placeholder: PropTypes.string
};

SearchBar.defaultProps = {
  disabled: false,
};

export default SearchBar;
