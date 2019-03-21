/** @format */

import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'antd';

const NoItems = ({ itemType, createItem = null }) => (
  <div className='dashboard__items-empty'>
    <span>No {itemType}s to show</span>
    <Button htmlType='button' className='ant-btn ant-btn-plain add-button' onClick={createItem}>
      Create a new {itemType}
    </Button>
  </div>
);

NoItems.propTypes = {
  itemType: PropTypes.string,
  createItem: PropTypes.func,
};

export default NoItems;
