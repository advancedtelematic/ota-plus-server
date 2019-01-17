/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';

import { Popover } from 'antd';
import _ from 'lodash';

import Content from './FeatureContent';
import { WHATS_NEW_DEFAULT_ACTIONS } from '../../../config';

import { FeatureImage } from './index';
import { WHATS_NEW_INITIAL_STEP } from '../../../config';

@inject('stores')
@observer
class WhatsNewGuide extends Component {
  @observable
  slides = [];
  @observable
  totalSteps = 0;
  @observable
  current = WHATS_NEW_INITIAL_STEP;

  static propTypes = {
    stores: PropTypes.object,
    features: PropTypes.object.isRequired,
    hide: PropTypes.func.isRequired,
    changeRoute: PropTypes.func,
  };

  constructor(props) {
    super(props);
    const { features } = props;
    this.slides = features.slides;
    this.totalSteps = features.total;
  }

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

    if (routeWillChange) changeRoute(url);

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

  next = () => this.slides[this.current].step.next;

  back = () => this.slides[this.current].step.previous;

  close = () => {
    const { stores, hide } = this.props;
    const { featuresStore } = stores;
    featuresStore.setWhatsNewHide();
    this.reset();
    hide();
  };

  delay = () => {
    const { stores, hide } = this.props;
    const { featuresStore } = stores;
    featuresStore.setWhatsNewDelay();
    this.reset();
    hide();
  };

  deny = () => {
    const { stores, hide } = this.props;
    const { featuresStore } = stores;
    featuresStore.setWhatsNewHide();
    this.reset();
    hide();
  };

  summary = () => {
    this.deny();
    const { changeRoute } = this.props;
    const url = '/whats-new';
    const routeCanChange = !_.isUndefined(changeRoute);
    if (routeCanChange) changeRoute(url);
  };

  renderButtons = () => {
    const { step, buttons } = this.slides[this.current];
    const labels = buttons || WHATS_NEW_DEFAULT_ACTIONS;
    const initialStep = !step.previous;
    const finalStep = !step.next;

    const actions = initialStep ? ['deny', 'delay', 'next'] : finalStep ? ['back', 'summary', 'close'] : _.map(WHATS_NEW_DEFAULT_ACTIONS, action => action.toLowerCase());

    return _.map(actions, (action, index) => {
      const validAction = !_.isUndefined(action);
      return (
        validAction && (
          <button key={index} type='button' className={`btn-${index === 2 ? 'primary' : 'bordered'}`} id={`button-${action}`} onClick={() => this.execute(action)}>
            <span className={`btn-${index === 2 ? 'primary' : 'bordered'}__label`}>{labels[index]}</span>
          </button>
        )
      );
    });
  };

  render() {
    const { feature, step } = this.slides[this.current];
    const { popoverImage } = feature;
    const renderImage = !_.isUndefined(popoverImage);
    let content = (
      <div>
        <div className='whats-new-popover__headline'>
          <h4>{`Step ${step.order}/${this.totalSteps}`}</h4>
        </div>
        <div className='whats-new-popover__body'>
          <Content data={feature} />
        </div>
        <div className='whats-new-popover__actions'>{this.renderButtons()}</div>
      </div>
    );

    return (
      <Popover
        onRequestClose={this.reset}
        content={content}
        visible={true}
        placement={step.order === 1 ? 'bottomRight' : 'right'}
        overlayClassName={`whats-new-popover ${step.order === 1 ? 'whats-new-popover__firstStep' : ''}`}
      >
        {renderImage && <FeatureImage feature={feature} />}
      </Popover>
    );
  }
}

export default WhatsNewGuide;
