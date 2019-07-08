/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';

class FormTextarea extends Component {
  componentDidMount() {
    const { previousValue, isEditable = true, defaultValue } = this.props;
    this.input.value = previousValue && previousValue.length
      ? previousValue
      : defaultValue && defaultValue.length ? defaultValue : '';
    if (!isEditable) {
      this.input.setAttribute('disabled', 'disabled');
    }
  }

  validateInput(e) {
    if (e.target.value.length > 0) {
      const { onValid } = this.props;
      if (onValid) {
        onValid(e);
      }
    } else {
      const { onInvalid } = this.props;
      if (onInvalid) {
        onInvalid(e);
      }
    }
  }

  render() {
    const {
      title = '',
      name,
      placeholder = '',
      isEditable = true,
      id,
      label = '',
      inputWidth = '100%',
      wrapperWidth = '100%',
      rows = 1,
      onChange = null
    } = this.props;
    return (
      <div className="c-form__relative-wrapper" style={{ width: wrapperWidth }}>
        <label title={title} htmlFor={id} className="c-form__label">
          {label || ''}
        </label>
        <div className="c-form__input-wrapper">
          <textarea
            name={name}
            id={id}
            rows={rows}
            // eslint-disable-next-line no-return-assign
            ref={input => (this.input = input)}
            style={{ width: inputWidth, paddingLeft: isEditable ? '10px' : 0 }}
            className="c-form__input"
            onKeyUp={this.validateInput.bind(this)}
            placeholder={placeholder || ''}
            onChange={onChange}
          />
        </div>
      </div>
    );
  }
}

FormTextarea.propTypes = {
  previousValue: PropTypes.string,
  isEditable: PropTypes.bool,
  defaultValue: PropTypes.string,
  onValid: PropTypes.func,
  onInvalid: PropTypes.func,
  title: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  inputWidth: PropTypes.string,
  wrapperWidth: PropTypes.string,
  onChange: PropTypes.func,
  rows: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
};

export default FormTextarea;
