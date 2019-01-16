/** @format */

import PropTypes from 'prop-types';
import React from 'react';

export const NetworkInfo = props => {
  const { data } = props;
  const { local_ipv4: ip, mac, hostname } = data;

  return (
    <div className='page-header__network-info'>
      <div className='page-header__device-report-item page-header__device-report-item--crop' id='ip-info'>
        <span className='page-header__device-report-label'>IP</span>
        <div className='page-header__device-report-desc' title={ip}>
          {ip || 'Not reported'}
        </div>
      </div>
      <div className='page-header__device-report-item page-header__device-report-item--crop' id='mac-info'>
        <span className='page-header__device-report-label'>MAC</span>
        <div className='page-header__device-report-desc' title={mac}>
          {mac || 'Not reported'}
        </div>
      </div>
      <div className='page-header__device-report-item page-header__device-report-item--crop' id='hostname-info'>
        <span className='page-header__device-report-label'>Hostname</span>
        <div className='page-header__device-report-desc' title={hostname}>
          {hostname || 'Not reported'}
        </div>
      </div>
    </div>
  );
};

NetworkInfo.propTypes = {
  data: PropTypes.object.isRequired,
};

export default NetworkInfo;
