/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Input } from 'formsy-antd';
import { Icon } from 'antd';

class SearchBar extends Component {
  clearInput = () => {
    this.props.changeAction('');
  };

  onChange = value => {
    let timeout = undefined;
    const { changeAction } = this.props;
    const filter = value;
    if (timeout != undefined) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      timeout = undefined;
      changeAction(filter);
    }, 500);
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
