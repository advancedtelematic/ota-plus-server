/** @format */

import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';

const NetworkInfo = (props) => {
  const { data, t } = props;
  const { local_ipv4: ip, mac, hostname } = data;

  return (
    <div className="page-header__network-info">
      <div className="page-header__device-report-item page-header__device-report-item--crop" id="ip-info">
        <span className="page-header__device-report-label">{t('devices.network.ip')}</span>
        <div className="page-header__device-report-desc" title={ip}>
          {ip || 'Not reported'}
        </div>
      </div>
      <div className="page-header__device-report-item page-header__device-report-item--crop" id="mac-info">
        <span className="page-header__device-report-label">{t('devices.network.mac')}</span>
        <div className="page-header__device-report-desc" title={mac}>
          {mac || 'Not reported'}
        </div>
      </div>
      <div className="page-header__device-report-item page-header__device-report-item--crop" id="hostname-info">
        <span className="page-header__device-report-label">{t('devices.network.hostname')}</span>
        <div className="page-header__device-report-desc" title={hostname}>
          {hostname || 'Not reported'}
        </div>
      </div>
    </div>
  );
};

NetworkInfo.propTypes = {
  data: PropTypes.shape({}).isRequired,
  t: PropTypes.func.isRequired
};

export default withTranslation()(NetworkInfo);
