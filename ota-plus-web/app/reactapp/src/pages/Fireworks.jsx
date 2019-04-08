/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import Cookies from 'js-cookie';
import _ from 'lodash';
import { FadeAnimation } from '../utils';

@inject('stores')
@observer
class Fireworks extends Component {
  static propTypes = {
    stores: PropTypes.object,
  };

  componentWillMount() {
    const { stores } = this.props;
    const { devicesStore } = stores;
    Cookies.set('fireworksPageAcknowledged', 1);
    devicesStore.fetchDevicesCount();
  }

  acknowledgeFireworks = () => {
    const { stores } = this.props;
    const { devicesStore } = stores;
    const { router } = this.context;
    const directorDeviceId = _.last(devicesStore.directorDevicesIds);
    router.history.push(`/device/${directorDeviceId}`);
  };

  render() {
    return (
      <FadeAnimation>
        <div className='wrapper-center'>
          <div className='fireworks'>
            <div className='fireworks__title'>CONGRATULATIONS</div>
            <div className='fireworks__body'>
              <img className='fireworks__icon' src='/assets/img/icons/fireworks_check.svg' alt='Image' />
              <div className='fireworks__subtitle'>Your first device is online!</div>
              <div className='fireworks__text'>Every time you build a new image, you can send it to this device over the air.</div>
            </div>
            <div className='fireworks__action'>
              <button className='fireworks__button btn-primary' onClick={this.acknowledgeFireworks}>
                Go to my device
              </button>
            </div>
          </div>
        </div>
      </FadeAnimation>
    );
  }
}

Fireworks.wrappedComponent.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default Fireworks;
