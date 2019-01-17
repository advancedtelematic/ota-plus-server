/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';

@observer
class ListHeader extends Component {
  static propTypes = {
    status: PropTypes.string,
    addNewWizard: PropTypes.func,
  };

  render() {
    const { status, addNewWizard } = this.props;
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
        <div className='campaigns__header-link'>
          <a
            className='add-button grey-button'
            id='add-new-campaign'
            onClick={e => {
              e.preventDefault();
              addNewWizard();
            }}
          >
            <span>{'+ Add campaign'}</span>
          </a>
        </div>
      </div>
    );
  }
}

export default ListHeader;
