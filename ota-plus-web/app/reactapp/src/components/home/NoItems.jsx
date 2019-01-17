/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';

const NoItems = ({ itemName, create = null }) => {
  return (
    <div className='home__items-empty'>
      <span>No {itemName}s to show</span>
      <a href='#' className='add-button' onClick={create}>
        Create a new {itemName}
      </a>
    </div>
  );
};

export default NoItems;
