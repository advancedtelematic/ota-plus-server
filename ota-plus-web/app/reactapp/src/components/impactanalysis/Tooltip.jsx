/** @format */

import PropTypes from 'prop-types';
import React from 'react';
import { OTAModal } from '../../partials';
import { IMPACT_TOOLTIP_IMG } from '../../config';

const Tooltip = ({ shown, hide }) => (
  <OTAModal
    title={(
      <div className="heading">
        <div className="internal">Blacklist</div>
      </div>
    )}
    content={(
      <span>
        <div className="text-center">
          {'With HERE OTA Connect, you can '}
          <strong>blacklist</strong>
          {' problem packages, ensuring they '}
          <br />
          {'won\'t get installed on any of your devices.'}
          <br />
          <br />
          {'On the '}
          <strong>Impact analysis tab</strong>
          {', you can view which of your devices already'}
          <br />
          {'have the blacklisted version of the package installed, letting you'}
          <br />
          {'proactively troubleshoot and update those devices to a fixed version,'}
          <br />
          {'or roll them back to an older version.'}
          <br />
          <br />
          <img src={IMPACT_TOOLTIP_IMG} alt="" />
        </div>
        <div className="body-actions">
          <button
            type="button"
            className="btn-primary"
            onClick={hide}
            id="impact-analysis-got-it﻿"
          >
            Got it
          </button>
        </div>
      </span>
        )}
    visible={shown}
  />
);

Tooltip.propTypes = {
  shown: PropTypes.bool,
  hide: PropTypes.func
};

export default Tooltip;
