/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';

@observer
class ListHeader extends Component {
  static propTypes = {
    status: PropTypes.string,
  };

  render() {
    const { status } = this.props;
    const headline = {
      prepared: 'In preparation',
      launched: 'running',
      finished: 'finished',
      cancelled: 'canceled',
    };
    const showColumns = status !== 'prepared';

    return (
      <div className='campaigns__header'>
        <div className='campaigns__column'>{headline[status]}</div>
        {showColumns && <div className='campaigns__column'>{'Created at'}</div>}
        {showColumns && <div className='campaigns__column'>{'Processed'}</div>}
        {showColumns && <div className='campaigns__column'>{'Affected'}</div>}
        {showColumns && <div className='campaigns__column'>{'Finished'}</div>}
        {showColumns && <div className='campaigns__column'>{'Failure rate'}</div>}
      </div>
    );
  }
}

export default ListHeader;
