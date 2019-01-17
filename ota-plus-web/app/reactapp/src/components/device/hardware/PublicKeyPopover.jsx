/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Popover } from 'antd';
import CopyToClipboard from 'react-copy-to-clipboard';
import { VelocityTransitionGroup } from 'velocity-react';
import _ from 'lodash';
import { Loader } from '../../../partials';

@inject('stores')
@observer
class PublicKeyPopover extends Component {
  componentWillMount() {
    const { device, serial } = this.props;
    const { hardwareStore } = this.props.stores;
    hardwareStore.fetchPublicKey(device.uuid, serial);
  }
  componentWillUnmount() {
    const { hardwareStore } = this.props.stores;
    hardwareStore._resetPublicKey();
  }
  render() {
    const { changePopoverVisibility, handleCopy, popoverShown, copied, serial, active } = this.props;
    const { hardwareStore } = this.props.stores;
    const content = (
      <div>
        {!hardwareStore.hardwarePublicKeyFetchAsync.isFetching && hardwareStore.publicKey.keyval ? (
          <span>
            <div className='heading'>
              <div className='internal'>Public key</div>
            </div>
            <div className='body'>
              <pre>{hardwareStore.publicKey.keyval.public}</pre>
            </div>
            <div className='actions'>
              <CopyToClipboard text={hardwareStore.publicKey.keyval.public} onCopy={handleCopy.bind(this, serial)}>
                <button className='btn-primary'>Copy to clipboard</button>
              </CopyToClipboard>
              <VelocityTransitionGroup
                enter={{
                  animation: 'fadeIn',
                }}
                leave={{
                  animation: 'fadeOut',
                }}
              >
                {copied ? <span className='clipboard-copied'>(Public key copied)</span> : null}
              </VelocityTransitionGroup>
            </div>
          </span>
        ) : null}
        {hardwareStore.hardwarePublicKeyFetchAsync.isFetching ? <Loader /> : null}
      </div>
    );
    return (
      <Popover trigger='click' placement='rightTop' overlayClassName='hardware-pk-popover' visible={popoverShown} content={content} onVisibleChange={changePopoverVisibility.bind(this, serial)}>
        {active ? (
          <img src='/assets/img/icons/white/key.svg' className='hardware-panel__ecu-action--key-size' alt='Icon' />
        ) : (
          <img src='/assets/img/icons/black/key.svg' className='hardware-panel__ecu-action--key-size' alt='Icon' />
        )}
      </Popover>
    );
  }
}

PublicKeyPopover.propTypes = {
  stores: PropTypes.object,
  popoverShown: PropTypes.bool.isRequired,
  copied: PropTypes.bool.isRequired,
};

export default PublicKeyPopover;
