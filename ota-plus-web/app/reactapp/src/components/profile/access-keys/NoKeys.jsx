/** @format */

import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { SecondaryButton } from '../../../partials';
import ReadMore from '../../../partials/ReadMore';
import UnderlinedLink from '../../../partials/UnderlinedLink';
import { KEY_ICON_WHITE, PLUS_ICON } from '../../../config';
import { URL_PROVISIONING_KEY } from '../../../constants/urlConstants';

const ICON_SIZE = 60;

const NoKeys = ({ showCreateModal, t }) => (
  <div className="wrapper-center">
    <div className="page-intro">
      <img src={KEY_ICON_WHITE} alt="Icon" width={ICON_SIZE} height={ICON_SIZE} />
      <div className="no-access-keys">
        {t('profile.provisioning-keys.no-keys-description-1')}
      </div>
      <ReadMore>
        <span>
          <span>{t('profile.provisioning-keys.no-keys-description-2')}</span>
          <UnderlinedLink url={URL_PROVISIONING_KEY}>{t('miscellaneous.read-more')}</UnderlinedLink>
        </span>
      </ReadMore>
      <SecondaryButton type="link" onClick={showCreateModal}>
        <img src={PLUS_ICON} />
        {t('profile.provisioning_keys.no-keys-button-title')}
      </SecondaryButton>
    </div>
  </div>
);

NoKeys.propTypes = {
  showCreateModal: PropTypes.func,
  t: PropTypes.func.isRequired
};

export default withTranslation()(NoKeys);
