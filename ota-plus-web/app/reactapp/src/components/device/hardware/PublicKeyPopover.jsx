/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Popover } from 'antd';
import CopyToClipboard from 'react-copy-to-clipboard';
import { VelocityTransitionGroup } from 'velocity-react';
import { Loader } from '../../../partials';

@inject('stores')
@observer
class PublicKeyPopover extends Component {
  componentWillMount() {
    const { device, serial, stores } = this.props;
    const { hardwareStore } = stores;
    hardwareStore.fetchPublicKey(device.uuid, serial);
  }

  componentWillUnmount() {
    const { stores } = this.props;
    const { hardwareStore } = stores;
    hardwareStore.resetPublicKey();
  }

  render() {
    const { changePopoverVisibility, handleCopy, popoverShown, copied, serial, active, stores } = this.props;
    const { hardwareStore } = stores;
    const content = (
      <div>
        {!hardwareStore.hardwarePublicKeyFetchAsync.isFetching && hardwareStore.publicKey.keyval ? (
          <span>
            <div className="heading">
              <div className="internal">Public key</div>
            </div>
            <div className="body">
              <pre>{hardwareStore.publicKey.keyval.public}</pre>
            </div>
            <div className="actions">
              <CopyToClipboard text={hardwareStore.publicKey.keyval.public} onCopy={() => handleCopy(serial)}>
                <button type="button" className="btn-primary">Copy to clipboard</button>
              </CopyToClipboard>
              <VelocityTransitionGroup
                enter={{
                  animation: 'fadeIn',
                }}
                leave={{
                  animation: 'fadeOut',
                }}
              >
                {copied ? <span className="clipboard-copied">(Public key copied)</span> : null}
              </VelocityTransitionGroup>
            </div>
          </span>
        ) : null}
        {hardwareStore.hardwarePublicKeyFetchAsync.isFetching ? <Loader /> : null}
      </div>
    );
    return (
      <Popover
        trigger="click"
        placement="rightTop"
        overlayClassName="hardware-pk-popover"
        visible={popoverShown}
        content={content}
        onVisibleChange={visible => changePopoverVisibility(serial, visible)}
      >
        {active ? (
          <img src="/assets/img/icons/white/key.svg" className="hardware-panel__ecu-action--key-size" alt="Icon" />
        ) : (
          <img src="/assets/img/icons/black/key.svg" className="hardware-panel__ecu-action--key-size" alt="Icon" />
        )}
      </Popover>
    );
  }
}

PublicKeyPopover.propTypes = {
  stores: PropTypes.shape({}),
  device: PropTypes.shape({}),
  serial: PropTypes.string,
  active: PropTypes.bool,
  popoverShown: PropTypes.bool.isRequired,
  copied: PropTypes.bool.isRequired,
  changePopoverVisibility: PropTypes.func,
  handleCopy: PropTypes.func
};

export default PublicKeyPopover;
