/** @format */

import React, { PropTypes } from 'react';
import { translate } from 'react-i18next';

const ConvertTime = props => {
  const { t, seconds } = props;
  return (
    <span>
      {seconds <= 60
        ? t('common.secondWithCount', { count: Math.round(seconds) })
        : seconds <= 3600
        ? t('common.minuteWithCount', { count: Math.round(seconds / 60) })
        : t('common.hourWithCount', { count: Math.round(seconds / 3600) })}
    </span>
  );
};

ConvertTime.propTypes = {
  seconds: PropTypes.number.isRequired,
};

export default translate()(ConvertTime);
