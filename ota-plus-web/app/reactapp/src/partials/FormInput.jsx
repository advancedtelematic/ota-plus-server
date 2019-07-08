/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';

class FormInput extends Component {
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
        onValid();
      }
    } else {
      const { onInvalid } = this.props;
      if (onInvalid) {
        onInvalid();
      }
    }
  }

  render() {
    const {
      title = '',
      name,
      placeholder = '',
      id,
      label = '',
      showIcon = false,
      showInput = true,
      inputWidth = '100%',
      wrapperWidth = '100%',
      onChange = null,
      statusIconShown = false,
      children,
      getInputRef = () => {},
    } = this.props;
    return (
      <div className="c-form__relative-wrapper" style={{ width: wrapperWidth }}>
        {label.length > 0 && (
          <label title={title} htmlFor={id} className="c-form__label">
            {label}
            {showIcon && <i className="c-form__icon fa fa-info" />}
          </label>
        )}
        {showInput ? (
          <div className="c-form__input-wrapper">
            {children}
            <input
              ref={(input) => {
                this.input = input;
                getInputRef(input);
              }}
              name={name}
              id={id}
              style={{ width: inputWidth }}
              className="c-form__input"
              type="text"
              onKeyUp={this.validateInput.bind(this)}
              placeholder={placeholder || ''}
              onChange={onChange}
            />
            {statusIconShown && <i className="fa fa-check c-form__select-icon" />}
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
}

FormInput.propTypes = {
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
  showIcon: PropTypes.bool,
  showInput: PropTypes.bool,
  inputWidth: PropTypes.string,
  wrapperWidth: PropTypes.string,
  onChange: PropTypes.func,
  statusIconShown: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.string
  ]),
  getInputRef: PropTypes.func
};

export default FormInput;
