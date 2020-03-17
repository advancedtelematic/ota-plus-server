/** @format */

import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { KEY_ICON_WHITE } from '../../../config';

const ICON_SIZE = 60;

const NoKeys = ({ showTooltip, t }) => (
  <div className="wrapper-center">
    <div className="page-intro">
      <img src={KEY_ICON_WHITE} alt="Icon" width={ICON_SIZE} height={ICON_SIZE} />
      <div className="no-access-keys">
        {t('profile.provisioning_keys.no_keys_description')}
      </div>
      <div>
        <a
          href="#"
          className="add-button light"
          onClick={showTooltip.bind(this)}
        >
          {t('profile.provisioning_keys.no_keys_button_title')}
        </a>
      </div>
    </div>
  </div>
);

NoKeys.propTypes = {
  showTooltip: PropTypes.func,
  t: PropTypes.func.isRequired
};

export default withTranslation()(NoKeys);
