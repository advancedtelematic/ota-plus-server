/** @format */

import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import { FadeAnimation } from '../utils';
import Cookies from 'js-cookie';
import _ from 'underscore';

@inject('stores')
@observer
class Fireworks extends Component {
  constructor(props) {
    super(props);
    this.acknowledgeFireworks = this.acknowledgeFireworks.bind(this);
  }
  componentWillMount() {
    const { devicesStore } = this.props.stores;
    Cookies.set('fireworksPageAcknowledged', 1);
    devicesStore.fetchDevicesCount();
  }
  acknowledgeFireworks() {
    const { devicesStore } = this.props.stores;
    let directorDeviceId = _.first(devicesStore.directorDevicesIds);
    this.context.router.push(`/device/` + directorDeviceId);
  }
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
  router: React.PropTypes.object.isRequired,
};

export default Fireworks;
