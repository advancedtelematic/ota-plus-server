/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';

@observer
class LastSoftwareItem extends Component {
  render() {
    const { pack } = this.props;
    const link = 'software-repository/' + pack.id.name;
    const createdDate = new Date(pack.createdAt);
    return (
      <Link to={`${link}`} className='home__list-item' title={pack.id.name + ' ' + pack.id.version} id={'link-software-' + pack.uuid}>
        <div className='home__body-col'>{pack.id.name}</div>
        <div className='home__body-col'>{pack.id.version.length > 10 ? pack.id.version.substring(0, 10) + '...' : pack.id.version}</div>
        <div className='home__body-col'>{createdDate.toDateString() + ' ' + createdDate.toLocaleTimeString()}</div>
      </Link>
    );
  }
}

LastSoftwareItem.propTypes = {
  pack: PropTypes.object.isRequired,
};

export default LastSoftwareItem;
