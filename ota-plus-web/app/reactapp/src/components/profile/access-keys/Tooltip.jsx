/** @format */

import PropTypes from 'prop-types';
import React from 'react';
import { Button, OTAModal } from '../../../partials';

const Tooltip = ({ shown, hide }) => {
  const content = (
    <div>
      <div className="text-center">
        {'HERE OTA Connect automatically provisions and activates your devices the first time they come online. '}
        {'Here, you can create and manage the provisioning keys linked to your account.'}
      </div>
      <div className="body-actions">
        <Button type="primary" light="true" htmlType="button" onClick={hide} id="provisioning-keys-got-it">
          Got it
        </Button>
      </div>
    </div>
  );

  return (
    <OTAModal
      title={(
        <div className="heading">
          <div className="internal">{'Credentials (provisioning)'}</div>
        </div>
      )}
      content={content}
      visible={shown}
      className="provisioning-key-tooltip"
    />
  );
};

Tooltip.propTypes = {
  shown: PropTypes.bool,
  hide: PropTypes.func,
};

export default Tooltip;
