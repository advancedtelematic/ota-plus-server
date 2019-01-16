/** @format */

import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import _ from 'underscore';

import { FeaturePopover, FeatureImage } from './index';
import { WHATS_NEW_INITIAL_STEP } from '../../../config';
import { VelocityTransitionGroup } from 'velocity-react';

@inject('stores')
@observer
class WhatsNew extends Component {
  @observable slides = this.props.features.slides;
  @observable totalSteps = this.props.features.total;
  @observable current = WHATS_NEW_INITIAL_STEP;

  execute = action => {
    switch (action) {
      case 'close':
        this.close();
        break;
      case 'delay':
        this.delay();
        break;
      case 'deny':
        this.deny();
        break;
      case 'summary':
        this.summary();
        break;
      case 'next':
        this.show(this.next());
        break;
      case 'back':
        this.show(this.back());
        break;
      default:
        break;
    }
  };

  show = item => {
    const { changeRoute } = this.props;
    const { url } = this.slides[item].feature;
    const routeCanChange = !_.isUndefined(changeRoute);
    const routeWillChange = !_.isUndefined(url) && this.routeWillChangeIf(item) && routeCanChange;

    routeWillChange && changeRoute(url);

    this.setCurrent(item);
  };

  routeWillChangeIf = item => {
    const { feature: next } = this.slides[item];
    const { feature: current } = this.slides[this.current];
    return !_.isEqual(current, next) || current.url !== next.url;
  };

  setCurrent = slide => {
    this.current = slide;
  };

  reset = () => {
    this.current = WHATS_NEW_INITIAL_STEP;
  };

  next = () => {
    return this.slides[this.current].step.next;
  };

  back = () => {
    return this.slides[this.current].step.previous;
  };

  close = () => {
    const { featuresStore } = this.props.stores;
    featuresStore.setWhatsNewHide();
    this.reset();
    this.props.hide();
  };

  delay = () => {
    const { featuresStore } = this.props.stores;
    featuresStore.setWhatsNewDelay();
    this.reset();
    this.props.hide();
  };

  deny = () => {
    const { featuresStore } = this.props.stores;
    featuresStore.setWhatsNewHide();
    this.reset();
    this.props.hide();
  };

  summary = () => {
    this.deny();
    const { changeRoute } = this.props;
    const url = '/whats-new';
    const routeCanChange = !_.isUndefined(changeRoute);
    routeCanChange && changeRoute(url);
  };

  render() {
    const { feature, step, buttons } = this.slides[this.current];
    const { popoverImage } = feature;
    const renderImage = !_.isUndefined(popoverImage);
    const popOverAnchor = this.current === WHATS_NEW_INITIAL_STEP ? this.refs.fakeLink : this.refs.images;

    return (
      <div>
        <div className='whats-new-keynotes__inner col-xs-6' ref='images'>
          {renderImage && (
            <VelocityTransitionGroup enter={{ animation: 'slideDown' }} leave={{ animation: 'fadeOut' }}>
              <FeatureImage feature={feature} />
            </VelocityTransitionGroup>
          )}
        </div>
        <div className='whats-new-keynotes__inner-with-anchor col-xs-6'>
          <div className='whats-new-keynotes__popover-anchor' ref='fakeLink' />
          <FeaturePopover feature={feature} step={step} buttons={buttons} totalSteps={this.totalSteps} callback={this.execute} anchor={popOverAnchor} />
        </div>
      </div>
    );
  }
}

WhatsNew.propTypes = {
  features: PropTypes.object.isRequired,
  hide: PropTypes.func.isRequired,
  changeRoute: PropTypes.func,
};

export default WhatsNew;
