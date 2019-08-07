/** @format */

import React, { Component } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import { SubHeader } from '../../partials';

@observer
class Header extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
  };

  render() {
    const { t } = this.props;
    return (
      <SubHeader>
        <a className="add-button grey-button" id="add-new-campaign">
          <span>{t('campaigns.create')}</span>
        </a>
      </SubHeader>
    );
  }
}

export default withTranslation()(Header);
