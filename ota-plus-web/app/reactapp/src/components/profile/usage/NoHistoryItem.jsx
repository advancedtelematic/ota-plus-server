/** @format */

import PropTypes from 'prop-types';
import React from 'react';

import { USAGE_ITEM_DATE_FORMAT } from '../../../constants/datesTimesConstants';

const NoHistoryItem = ({ date }) => {
  const dateFormatted = date.format(USAGE_ITEM_DATE_FORMAT);
  return (
    <div className="box" id={`no-history-${dateFormatted}`}>
      <div className="column">{dateFormatted}</div>
      <div className="column no-history">No history</div>
    </div>
  );
};

NoHistoryItem.propTypes = {
  date: PropTypes.shape({}).isRequired,
};

export default NoHistoryItem;
