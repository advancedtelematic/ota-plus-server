/** @format */

import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'antd';

const NoItems = ({ createItem, description, actionText }) => (
  <div className="dashboard__items-empty">
    <span>{description}</span>
    <Button htmlType="button" className="add-button add-button--borderless" onClick={createItem}>
      {actionText}
    </Button>
  </div>
);


NoItems.propTypes = {
  actionText: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  createItem: PropTypes.func,
  description: PropTypes.string
};

export default NoItems;
