/** @format */

import PropTypes from 'prop-types';
import React from 'react';

const Option = ({ selectOption, iconSrc, isSelected, title, teaser }) => (
  <div
    className="wizard__option"
    onClick={() => {
      selectOption();
    }}
  >
    <div className="wizard__select">
      <button
        type="button"
        id={`wizard__${title}-checkbox`}
        className={`btn-radio${isSelected ? ' checked' : ''}`}
        onClick={() => {
          selectOption();
        }}
      />
      <img className="wizard__select-icon" src={iconSrc} />
      <div className="wizard__select-title">{title}</div>
    </div>
    <div className="wizard__teaser" id={`wizard__teaser-${title}`}>
      {teaser}
    </div>
  </div>
);

Option.propTypes = {
  selectOption: PropTypes.func,
  iconSrc: PropTypes.string,
  isSelected: PropTypes.bool,
  title: PropTypes.string,
  teaser: PropTypes.string
};

export default Option;
