/** @format */

import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'antd';
import { withTranslation } from 'react-i18next';

const NoItems = ({ createItem, itemType, t }) => (
  <div className="dashboard__items-empty">
    <span>
      {t('dashboard.no_items.description', { type: itemType })}
    </span>
    <Button htmlType="button" className="ant-btn ant-btn-plain add-button" onClick={createItem}>
      {t('dashboard.no_items.create_new', { type: itemType })}
    </Button>
  </div>
);


NoItems.propTypes = {
  createItem: PropTypes.func,
  itemType: PropTypes.string,
  t: PropTypes.func.isRequired
};

export default withTranslation()(NoItems);
