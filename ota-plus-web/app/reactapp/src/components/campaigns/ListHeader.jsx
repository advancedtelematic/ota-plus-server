/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { CAMPAIGNS_STATUS_PREPARED } from '../../config';

@observer
class ListHeader extends Component {
  static propTypes = {
    status: PropTypes.string.isRequired,
  };

  render() {
    const { status } = this.props;
    const showColumns = status !== CAMPAIGNS_STATUS_PREPARED;

    return (
      <div className="campaigns__header">
        <div className="campaigns__column">{'Name'}</div>
        {showColumns && (
          <>
            <div className="campaigns__column">{'Created at'}</div>
            <div className="campaigns__column">{'Status'}</div>
            <div className="campaigns__column">{'Selected devices'}</div>
            <div className="campaigns__column">{'Failed %'}</div>
            <div className="campaigns__column">{'Successful %'}</div>
            <div className="campaigns__column">{'Installing %'}</div>
            <div className="campaigns__column">{'Not applicable %'}</div>
          </>
        )}
        <div className="campaigns__column">{''}</div>
      </div>
    );
  }
}

export default ListHeader;
