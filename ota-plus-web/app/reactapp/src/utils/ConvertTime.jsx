/** @format */

import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';

const ConvertTime = (props) => {
  const { t, seconds } = props;
  return (
    <span>
      {seconds <= 60
        ? t('time.second_count', { count: Math.round(seconds) })
        : seconds <= 3600
          ? t('time.minute_count', { count: Math.round(seconds / 60) })
          : t('time.hour_count', { count: Math.round(seconds / 3600) })}
    </span>
  );
};

ConvertTime.propTypes = {
  seconds: PropTypes.number.isRequired,
  t: PropTypes.func.isRequired
};

export default withTranslation()(ConvertTime);
