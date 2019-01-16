/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import moment from 'moment';

class NoHistoryItem extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { date } = this.props;
    const dateFormatted = date.format('MMM YYYY');
    return (
      <div className='box' id={'no-history-' + dateFormatted}>
        <div className='column'>{dateFormatted}</div>
        <div className='column no-history'>No history</div>
      </div>
    );
  }
}

NoHistoryItem.propTypes = {
  date: PropTypes.object.isRequired,
};

export default NoHistoryItem;
